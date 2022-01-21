import api from "../index"
import {describe} from "mocha";

let http = api.http("http://localhost:8080", {
	before: function (config) {
		return config
	},
	success: (res) => {
		console.log(res)
	},
	failure: (err) => {
		console.log(err)
	}
});

describe("get", function () {
	describe("ping", function () {
		http.get("ping", {})
	});
});
