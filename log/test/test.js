import logger from "../index"
import {describe} from "mocha";

let log = new logger("app-web-tracking", "api-error", {});

describe("upload", function () {
   log.send("visited", {
      user_id: "21",
   })
});
