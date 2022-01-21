import "node-localstorage/register"
import global from "./global";

export default function () {
	let storage = new global();
	this.get = (key) => {
		return storage.get(key);
	};
	this.set = (key, val) => {
		return storage.set(key, val);
	};
}
