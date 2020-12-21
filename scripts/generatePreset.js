#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');

const buildStringFromPackage = async packages => {
  let importStringToWrite = '',
    pluginsStringToWrite = '';
  for (const pkg of packages) {
    const packageJson = fs.readJsonSync(`${pkg}/package.json`);
    importStringToWrite += `import ${packageJson.pluginName} from '${packageJson.name}';\n`;
    pluginsStringToWrite += `new ${packageJson.pluginName}().configure({ key: '${packageJson.pluginName}' }),\n`;
  }

  return { importStringToWrite, pluginsStringToWrite };
};
const pkgGlob = process.argv[2] || '*';

const packages = fg.sync([`${process.env.GITHUB_WORKSPACE}/superset-viz-plugins/plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

const file = `./${process.env.PRESET_NAME}Preset.ts`;
let importStringToWrite = `import { Preset } from '@superset-ui/core';
`;
let pluginsStringToWrite = '';
buildStringFromPackage(packages).then(result => {
  importStringToWrite += result.importStringToWrite;
  pluginsStringToWrite += result.pluginsStringToWrite;
  const stringToWrite = `${importStringToWrite} 
export default class ${process.env.PRESET_NAME}Preset extends Preset {
  constructor() {
    super({
      name: '${process.env.PRESET_NAME} charts',
      plugins: [
        ${pluginsStringToWrite}
      ],
    });
  }
}
`;

  // With a callback:
  fs.outputFile(file, stringToWrite, err => {
    if (err) {
      console.log(err);
    }
  });
});
