#!//bin/bash
set -e
bash --version

echo $GITHUB_WORKSPACE

# Add dependencies superset-frontend and generate the preset
cp .npmrc $GITHUB_WORKSPACE/incubator-superset/superset-frontend/.npmrc
cd $GITHUB_WORKSPACE/incubator-superset/superset-frontend

# add dependecies to pacakge.json
node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/addDependencies.js

# generate preset file and locate in incubator source code
node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/generatePreset.js
cat ./NielsenPreset.ts
mv ./NielsenPreset.ts ./src/visualizations/presets/NielsenPreset.js

# override setupPluginsExtra in incubator source code
node $GITHUB_WORKSPACE/superset-viz-plugins/scripts/generateSetupPluginsExtra.js
cat ./$PLUGINS_EXTRA_FILENAME
cp ./${PLUGINS_EXTRA_FILENAME} /src/setup/${PLUGINS_EXTRA_FILENAME}

npm install
