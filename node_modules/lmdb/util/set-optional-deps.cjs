let fs = require('fs');
packageData = JSON.parse(fs.readFileSync('package.json'));
let prebuilds = fs.readdirSync('prebuilds');
let platformDeps = packageData.optionalDependencies = {};
let packageName = packageData.name;
let version = packageData.version;
for (let prebuild of prebuilds) {
	platformDeps['@' + packageName + '/' + packageName + '-' + prebuild] = version;
}
/*if (version.endsWith('-v1')) {
	packageData.version = version.slice(0, -3);
	packageData.name = packageName + '-v1';
}*/
fs.writeFileSync('package.json', JSON.stringify(packageData, null, 2));
