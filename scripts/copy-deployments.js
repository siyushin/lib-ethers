var _a;
var fs = require("fs");
var path = require("path");
var outputDir = "deployments";
var inputDir = function (channel) { return path.join("deployments", channel); };
var backfillChannel = "backfill";
var defaultChannel = "default";
var exists = function (dir) {
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
};
var copyDeploymentsFrom = function (deploymentsDir) {
    var deployments = fs.readdirSync(deploymentsDir);
    for (var _i = 0, deployments_1 = deployments; _i < deployments_1.length; _i++) {
        var deployment = deployments_1[_i];
        fs.copyFileSync(path.join(deploymentsDir, deployment), path.join(outputDir, deployment));
    }
};
console.log("Deployment channel: ".concat((_a = process.env.CHANNEL) !== null && _a !== void 0 ? _a : "default"));
copyDeploymentsFrom(inputDir(backfillChannel));
copyDeploymentsFrom(inputDir(defaultChannel));
if (process.env.CHANNEL && process.env.CHANNEL !== defaultChannel) {
    var channelDir = inputDir(process.env.CHANNEL);
    if (exists(channelDir)) {
        copyDeploymentsFrom(channelDir);
    }
}
