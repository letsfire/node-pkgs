import OSS from "ali-oss"

let isUndefined = (value) => {
	return typeof value === "undefined"
}

let items = function (items) {
	const self = this;
	self.cursor = 0;
	self.__fetch = () => {
		if (items.length === this.cursor) {
			return null
		}
		return items[self.cursor++]
	}
}

let uploader = function (oss, itemFetcher) {
	const self = this;
	self.managers = [];
	self.multipartUpload = (suffix, file, args, opts) => {
		if (isUndefined(self.managers[suffix])) {
			self.managers[suffix] = new manager(oss, () => itemFetcher(suffix));
		}
		return self.managers[suffix].multipartUpload(file, args, opts);
	}
}

let manager = function (oss, itemFetcher) {
	const self = this;
	self.items = null;
	self.callback = {};
	self.__fetch = async () => {
		if (self.items !== null) {
			let item = self.items.__fetch();
			if (item !== null) return item;
		}
		const {
			granted_items, callback_url, callback_body
		} = await itemFetcher();
		self.items = new items(granted_items);
		self.callback = {url: callback_url, body: callback_body};
		return self.__fetch();
	};
	self.multipartUpload = async (file, args, opts) => {
		const {object_name, resource_id} = await self.__fetch();
		if (self.callback.url) {
			args = Object.assign(args, {"resource": resource_id});
			const callback = Object.assign({customValue: args}, self.callback);
			opts = Object.assign({callback: callback}, opts)
		}
		await oss.multipartUpload(object_name, file, opts);
		return resource_id;
	};
};

export default function (stsFetcher) {
	let oss = null;
	this.ready = async () => {
		const {
			region, bucket, endpoint, access_key_id,
			access_key_secret, security_token, expiration,
		} = await stsFetcher();
		oss = new OSS({
			region: region,
			bucket: bucket,
			endpoint: endpoint,
			accessKeyId: access_key_id,
			accessKeySecret: access_key_secret,
			stsToken: security_token,
			refreshSTSToken: async () => {
				const {
					access_key_id, access_key_secret, security_token,
				} = await stsFetcher();
				return {
					accessKeyId: access_key_id,
					accessKeySecret: access_key_secret,
					stsToken: security_token
				}
			},
			refreshSTSTokenInterval: (expiration - 60) * 1000 - new Date().getTime()
		});
	}
	this.uploader = function (itemFetcher) {
		console.assert(oss, "oss unready, please call ready first");
		return new uploader(oss, itemFetcher);
	}
	this.putObject = function (name, file, options) {
		console.assert(oss, "oss unready, please call ready first");
		return oss.put(name, file, options);
	}
	this.signatureUrl = function (name, ttl, options) {
		console.assert(oss, "oss unready, please call ready first");
		return oss.signatureUrl(name, Object.assign({expires: ttl}, options));
	}
};
