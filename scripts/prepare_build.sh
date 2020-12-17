#!//bin/bash
set -e

#migrated from old repo, probably not needed
# yarn
pwd


# Add dependencies superset-frontend and generate the preset
cp .npmrc ../../incubator-superset/superset-frontend/.npmrc
cd ../../incubator-superset/superset-frontend



node ../../superset-viz-plugins/scripts/addDependencies.js
node ../../superset-viz-plugins/scripts/generateMafPreset.js
mv ./MafPreset.ts ./src/visualizations/presets/MafPreset.js
cp ../../superset-viz-plugins/templates/setupPluginsExtra.js ./src/setup/setupPluginsExtra.js
npm install
