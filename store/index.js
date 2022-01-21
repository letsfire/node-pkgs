import global from "./src/global";

let cache = {};

let isDefined = (value) => {
	return typeof value !== "undefined" && value !== null;
};

export default function (storage) {
	if (!isDefined(storage)) {
		storage = new global();
	}
	this.get = (key, subKey) => {
		if (isDefined(cache[key]) === false) {
			let res = storage.get(key);
			cache[key] = isDefined(res) ? JSON.parse(res) : {val: null};
		}
		if (isDefined(cache[key].val) === false) return null;
		return isDefined(subKey) ? cache[key].val[subKey] : cache[key].val;
	};
	this.save = (key, val) => {
		cache[key] = {val: val}; // save as cache
		return storage.set(key, JSON.stringify(cache[key]))
	};
	this.clean = (key) => {
		return this.save(key, null); // set null as clean cache
	}
}
