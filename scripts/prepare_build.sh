#!//bin/bash
set -e
bash --version

echo $GITHUB_WORKSPACE

# Add dependencies superset-frontend and generate the preset
cp .npmrc $GITHUB_WORKSPACE/superset/superset-frontend/.npmrc
cd $GITHUB_WORKSPACE/superset/superset-frontend

# add dependencies to package.json
node $GITHUB_WORKSPACE/$PROJECT_WORKING_DIRECTORY/scripts/addDependencies.js

# generate preset file and locate in incubator source code
node $GITHUB_WORKSPACE/$PROJECT_WORKING_DIRECTORY/scripts/generatePreset.js
mv "./${PRESET_NAME}Preset.ts" "./src/visualizations/presets/${PRESET_NAME}Preset.js"

# generate setupPluginsExtra override in incubator source code
node $GITHUB_WORKSPACE/$PROJECT_WORKING_DIRECTORY/scripts/generateSetupPluginsExtra.js
cp "./${PLUGINS_EXTRA_FILENAME}" "src/setup/${PLUGINS_EXTRA_FILENAME}"

npm install
