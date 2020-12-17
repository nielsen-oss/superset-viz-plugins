yarn
# get branch name
$BRANCH_NAME=0.38

# Clone the repos
cd ..
git clone --single-branch --branch $FORK_BRANCH_NAME git@github.com:apache/incubator-superset.git
# Add dependencies superset-frontend and generate the preset
cp .npmrc ./incubator-superset/superset-frontend/.npmrc
cd incubator-superset/superset-frontend


cd 
node ../../scripts/addDependencies.js
node ../../scripts/generateMafPreset.js
mv ./MafPreset.ts ./src/visualizations/presets/MafPreset.js
cp ../../templates/setupPluginsExtra.js ./src/setup/setupPluginsExtra.js
npm install