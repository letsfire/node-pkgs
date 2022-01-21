import fs from "fs";
import api from "@ideawell/api"
import oss from "../index"
import {describe} from "mocha";

let http = api.http("http://localhost:8080");

let _oss = new oss(() => {
	return http.get("v1/tickets/oss2?session=20211215&ttl=1800")
});

describe("upload", async function () {
	await _oss.ready().catch(err => console.log(err));
	_oss.putObject("oss_test.jpg", fs.readFileSync("./test/test.jpg"));
	console.log(_oss.signatureUrl("ap/x68/06r/ax6806rwqsqp.jpg"));
});
