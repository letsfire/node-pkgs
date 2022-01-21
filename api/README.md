### 通用API客户端

```javascript
import api from "@basic/api";
let http = api.http("http://api.ing-sports.com");
http.get("ping", {}).then(res => {}, err => {});
```
