const {ethers, deployments, getNamedAccounts} = require("hardhat")
module.exports = async({getNamedAccounts, deployments}) => {
    console.log("network.name: ", network.name)
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments

    log("deploying MyToken contract")
    await deploy("MyToken", {
            contract: "MyToken",
            from: firstAccount, 
            args: ["MyToken", "MT"], 
            log: true, 
        })
    log("MyToken deployed successfully")
};
module.exports.tags = ["factory","mt", "v1", "v2", "sepolia"] 