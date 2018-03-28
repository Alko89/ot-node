var Migrations = artifacts.require('Migrations'); // eslint-disable-line no-undef

module.exports = function (deployer) {
    // Deploy the Migrations contract as our only task
    deployer.deploy(Migrations);
};
