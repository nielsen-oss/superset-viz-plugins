#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');
var child_process = require('child_process');

async function installPlugins(packages) {
  for (const pkg of packages) {
    const packageJson = fs.readJsonSync(`${pkg}/package.json`)
    child_process.execSync(`npm install ${packageJson.name}`, { stdio: [0, 1, 2] });
  }
}

const pkgGlob = process.argv[2] || '*';

const packages = fg.sync([`plugins/${pkgGlob}`], {
  onlyDirectories: true,
});

installPlugins(packages);
