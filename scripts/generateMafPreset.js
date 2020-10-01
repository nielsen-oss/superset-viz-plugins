#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');

const buildStringFromPackage = async packages => {
  let importStringToWrite = '',
    pluginsStringToWrite = '';
  for (const pkg of packages) {
    const packageJson = fs.readJsonSync(`${pkg}/package.json`);
    importStringToWrite += `import { ${packageJson.pluginName} } from '${packageJson.name}';\n`;
    pluginsStringToWrite += `new ${packageJson.pluginName}().configure({ key: '${packageJson.pluginName}' }),\n`;
  }

  return { importStringToWrite, pluginsStringToWrite };
};
const pkgGlob = process.argv[2] || '*';

const packages = fg.sync([`./superset-maf-ui/plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

const file = './MafPreset.ts';
let importStringToWrite = `import { Preset } from '@superset-ui/core';
import { DeckGLChartPreset } from '@superset-ui/legacy-preset-chart-deckgl';
`;
let pluginsStringToWrite = '';
buildStringFromPackage(packages).then(result => {
  importStringToWrite += result.importStringToWrite;
  pluginsStringToWrite += result.pluginsStringToWrite;
  const stringToWrite = `${importStringToWrite} 
export default class MafPreset extends Preset {
  constructor() {
    super({
      name: 'MAF charts',
      presets: [new DeckGLChartPreset()],
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
