
var potting = artifacts.require("potting");

module.exports = function(deployer) {
  deployer.deploy(potting,100);
};