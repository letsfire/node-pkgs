let isDefined = (value) => {
	return typeof value !== "undefined" && value !== null && value !== "";
};

let formatStr = (value) => {
	return isDefined(value) ? value : "";
}

let wrapStore = function (store) {
	this.get = (key) => {
		return store.get("auth-token", key);
	};
	this.save = (res) => {
		return store.save("auth-token", res);
	};
	this.clean = () => {
		return store.clean("auth-token");
	};
};

export default function (store, loginFunc, refreshFunc) {
	let self = this;
	let refreshHandle = null;
	let storeWrapper = new wrapStore(store);
	let watch = async (result) => {
		if (refreshHandle !== null) {
			clearTimeout(refreshHandle);
			refreshHandle = null;
		}
		await storeWrapper.save(result);
		const {expired_time} = result;
		const delay = expired_time * 1000 - new Date().getTime();
		if (delay <= 0) await self.refresh();
		else refreshHandle = setTimeout(self.refresh, delay);
	};
	this.login = (args) => {
		return loginFunc(args).then(watch);
	};
	this.logout = () => {
		clearTimeout(refreshHandle);
		return storeWrapper.clean();
	};
	this.getToken = () => {
		return formatStr(storeWrapper.get("access_token"));
	};
	this.getUserId = () => {
		return formatStr(storeWrapper.get("user_id"));
	};
	this.isGuest = () => {
		return isDefined(storeWrapper.get("user_id")) === false;
	};
	this.refresh = () => {
		let rtk = storeWrapper.get("refresh_token");
		return refreshFunc(formatStr(rtk)).then(watch).catch(this.logout);
	};
	this.ready = self.refresh;
}
