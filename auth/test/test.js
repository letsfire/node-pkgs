import api from "@ideawell/api"
import store from "@ideawell/store"
import auth from "../index"
import {describe} from "mocha";
import nodejs from "@ideawell/store/src/nodejs";

let http = api.http("http://localhost:8080");

let loginFunc = (args) => http.post("v1/auth/login", args);

let refreshFunc = (rtk) => {
	let opts = {headers: {"x-refresh-token": rtk}};
	return http.get("v1/auth/refresh", {}, opts);
}

let authMgr = new auth(new store(new nodejs()), loginFunc, refreshFunc);

describe("auth", async function () {
	await authMgr.ready();
	console.log(authMgr.isGuest());
	authMgr.login({
		mobile: "17757171482",
		password: "999999",
		platform: 1,
	}).then(async () => {
		console.log(await authMgr.getToken());
		console.log(await authMgr.getUserId());
		console.log(await authMgr.isGuest());
		clearTimeout(await authMgr.logout());
		console.log(await authMgr.isGuest());
	}, err => {
		console.log(err);
	});
});
