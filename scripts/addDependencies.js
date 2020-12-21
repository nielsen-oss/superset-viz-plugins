#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');

async function getDependenciesList(packages) {
  const dependencies = {};
  for (const pkg of packages) {
    const packageJson = fs.readJsonSync(`${pkg}/package.json`);
    dependencies[packageJson.name] = `^${packageJson.version}`;
    // child_process.execSync(`npm install ${packageJson.name}`, { stdio: [0, 1, 2] });
  }

  return dependencies
}

const pkgGlob = process.argv[2] || '*';
const packages = fg.sync([`${process.env.GITHUB_WORKSPACE}/superset-viz-plugins/plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

getDependenciesList(packages).then(data => {
    const packageJsonPath = './package.json'
    const packageJson = fs.readJsonSync(packageJsonPath);
    packageJson.dependencies = {...packageJson.dependencies, ...data}
    fs.outputJsonSync(packageJsonPath, packageJson)
});
