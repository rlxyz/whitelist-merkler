# whitelist-merkler

Example usage:
```javascript
import path from "path"; // Path routing
import { createJsonWhitelistMerkleRoot } from "@rhapsodylabs/whitelist-merkler"; // Generator

// Config file path
const whitelistPath: string = path.join(__dirname,"/storage/whitelist/whitelist.json");
const outputPath: string = path.join(__dirname,  "./storage/whitelist/whitelist-merkle.json");

(async () => {
  await createJsonWhitelistMerkleRoot(whitelistPath, outputPath);
})();
```

And the `whitelist.json`

```json
{
  "whitelist": {
    "<address-A>": 4,
    "<address-B>": 2,
  }
}
```
