import http from "./src/http"

export default {
	http(url, opts) {
		let defaultOpts = {
			before: (config) => {
				return config
			},
			success: (result) => {
				return Promise.resolve(result);
			},
			failure: (error) => {
				return Promise.reject(error);
			},
			reportClientError: (error) => {
				console.error(error);
			},
		};
		return new http(url, Object.assign(defaultOpts, opts));
	}
}
