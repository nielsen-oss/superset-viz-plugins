#!/bin/env node
/* eslint-disable no-console */
const fg = require('fast-glob');
const fs = require('fs-extra');

generate(`${process.env.PRESET_NAME}`)
function generate(name) {
  const stringToWrite = `/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import ${name}Preset from '../visualizations/presets/${name}Preset'
// For individual deployments to add custom overrides
export default function setupPluginsExtra() {
    new ${name}Preset().register();
}

`;

  // With a callback:
  fs.outputFile(`${process.env.PLUGINS_EXTRA_FILENAME}`, stringToWrite, err => {
    if (err) {
      console.log(err);
    }
  });
}
