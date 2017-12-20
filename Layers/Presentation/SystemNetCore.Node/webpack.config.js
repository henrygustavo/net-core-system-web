var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === "prod";
var config;

if (isProd) {
    config = require("./config/webpack.prod.js");
} else {
    config = require("./config/webpack.dev.js");
}

module.exports = config;