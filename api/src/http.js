import axios from "axios"

let isDefined = (value) => {
	return typeof value !== "undefined" && value !== null
};

let errorStatus = function (sys_code, err_code, err_desc, prev_err) {
	this.sys_code = sys_code;
	this.err_code = err_code;
	this.err_desc = err_desc;
	while (isDefined(prev_err)) {
		const {
			sys_code: sys_code1,
			err_code: err_code1,
			err_desc: err_desc1,
			prev_err: prev_err1
		} = prev_err;
		this.sys_code = sys_code1;
		this.err_code = err_code1;
		this.err_desc = err_desc1;
		prev_err = prev_err1;
	}
};

export default function (url, opts) {
	const http = axios.create({baseURL: url});
	http.interceptors.request.use(async (config) => {
		return await opts.before(config);
	});
	http.interceptors.response.use(response => {
		const {error, result} = response.data;
		const {is_ok, sys_code, err_code, err_desc, prev_err} = error;
		if (is_ok) {
			return Promise.resolve(result);
		} else {
			return Promise.reject(new errorStatus(sys_code, err_code, err_desc, prev_err));
		}
	}, error => {
		opts.reportClientError(error);
		if (isDefined(error.response)) {
			return Promise.reject(new errorStatus(0, error.response.status, error.response.statusText, null));
		} else {
			return Promise.reject(new errorStatus(0, 505, `Unsupported Http`, null))
		}
	});
	this.get = (path, args, config) => {
		if (isDefined(config)) {
			config.params = args;
		} else {
			config = {params: args}
		}
		config = Object.assign({}, opts, config);
		return http.get(path, config).then(config.success).catch(config.failure);
	};
	this.put = (path, data, config) => {
		config = Object.assign({}, opts, config);
		return http.put(path, data, config).then(config.success).catch(config.failure);
	};
	this.post = (path, data, config) => {
		config = Object.assign({}, opts, config);
		return http.post(path, data, config).then(config.success).catch(config.failure);
	};
	this.patch = (path, data, config) => {
		config = Object.assign({}, opts, config);
		return http.patch(path, data, config).then(config.success).catch(config.failure);
	};
	this.delete = (path, args, config) => {
		if (isDefined(config)) {
			config.params = args;
		} else {
			config = {params: args}
		}
		config = Object.assign({}, opts, config);
		return http.delete(path, config).then(config.success).catch(config.failure);
	};
};
