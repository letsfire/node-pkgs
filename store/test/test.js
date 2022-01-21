import store from "../index"
import node from "../src/nodejs"
import {describe} from "mocha";

let s = new store(new node());

describe("auth", function () {
	s.save("test", 1);
	console.log(s.get("test") === 1);
	s.clean("test");
	console.log(s.get("test") === null);
	s.save("test", {key: 1});
	console.log(s.get("test", "key") === 1);
});
