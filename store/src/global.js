import Cookies from "js-cookie"

let local = function () {
	this.getItem = (key) => {
		return global.localStorage.getItem(key);
	};
	this.setItem = (key, val) => {
		return global.localStorage.setItem(key, val);
	};
	this.removeItem = (key) => {
		return global.localStorage.removeItem(key);
	};
	console.log("use local storage");
};

let cookie = function () {
	this.getItem = (key) => {
		return Cookies.get(key);
	};
	this.setItem = (key, val) => {
		return Cookies.set(key, val)
	};
	console.log("use cookie storage");
};

export default function () {
	let storage = new local();
	try {
		storage.setItem("isPrivateMode", "1");
		storage.removeItem("isPrivateMode");
	} catch (e) {
		storage = new cookie();
	}
	this.get = (key) => {
		return storage.getItem(key);
	};
	this.set = (key, val) => {
		return storage.setItem(key, val);
	};
}
