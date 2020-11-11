const base = require("./jest.config.base.js");

module.exports = {
    ...base,
    projects:
    [
        "<rootDir>/packages/*/jest.config.js",
        "<rootDir>/plugins/*/jest.config.js"
    ],
    coverageDirectory: "<rootDir>/coverage/"
};