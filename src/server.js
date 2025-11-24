const config = require("./config/env");
const app = require("./app");

const HOST = "0.0.0.0"
app.listen(config.port, HOST, () => {
    console.log(`TestWeaver API running on port ${config.port}`);
});