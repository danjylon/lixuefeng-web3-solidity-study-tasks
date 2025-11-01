const {DECIMAL, INITIAL_ETH_ANSWER, INITIAL_ERC20_ANSWER, INITIAL_LINK_ANSWER, INITIAL_USDC_ANSWER, developChains, networkConfig} = require("../env-config")
module.exports = async({getNamedAccounts, deployments}) => {
    console.log("network.name: ", network.name)
    if (developChains.includes(network.name)) {
        console.log("this is a deploy function")
        const {firstAccount} = await getNamedAccounts() 
        console.log("firstAccount: ", firstAccount)
        const {deploy} = deployments
        await deploy("MockV3Aggregator", {
            from: firstAccount, 
            args: [DECIMAL, INITIAL_ETH_ANSWER], 
            log: true, 
        })
        await deploy("MockV3AggregatorErc20", {
            from: firstAccount, 
            args: [DECIMAL, INITIAL_ERC20_ANSWER], 
            log: true, 
        })
    } else {
        console.log("network is not local or hardhat")
    }
};

module.exports.tags = ["factory", "mock", "v1", "v2"] 