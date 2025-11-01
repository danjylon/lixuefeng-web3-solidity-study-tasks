const {ethers, deployments, getNamedAccounts} = require("hardhat")
module.exports = async({getNamedAccounts, deployments}) => {
    console.log("network.name: ", network.name)
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments

    log("deploying MyNFTToken contract")
    await deploy("MyNFTToken", {
            contract: "MyNFTToken",
            from: firstAccount, 
            args: ["MyNFTToken", "MNT"], 
            log: true, 
        })
    log("MyNFTToken deployed successfully")
};
module.exports.tags = ["factory","nft", "all", "v1", "v2", "sepolia"] 