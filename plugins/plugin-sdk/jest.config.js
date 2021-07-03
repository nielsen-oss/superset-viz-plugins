const base = require("../../jest.config.base.js");
const packagesFile = require('./package.json')

module.exports = {
    ...base,
    name: packagesFile.name,
    setupFilesAfterEnv: ['../../setupJest.js']
};