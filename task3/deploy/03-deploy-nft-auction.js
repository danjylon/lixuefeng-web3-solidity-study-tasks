
const { ethers, deployments, upgrades, getNamedAccounts } = require("hardhat");
const fs = require("fs");
const path = require("path");

module.exports = async({getNamedAccounts, deployments}) => {
    console.log("network.name: ", network.name)
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log, save} = deployments

    log("deploying NftAuction contract")
    const nftAuction = await ethers.getContractFactory("NftAuction")
    // 通过代理部署合约
    const nftAuctionProxy = await upgrades.deployProxy(nftAuction, [firstAccount], {
        kind: 'transparent', // 显式指定透明代理 模式 //'uups', // 显式指定 UUPS 模式
        initializer: "initialize",
    })
    
    await nftAuctionProxy.waitForDeployment();

    const proxyAddress = await nftAuctionProxy.getAddress()
    console.log("代理合约地址：", proxyAddress);
    const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress)
    console.log("实现合约地址：", implAddress);
    log("NftAuction deployed successfully")

    // 给代理合约起个名字并将代理合约与这个json文件关联起来
    await save("NftAuctionProxy", {
        abi: nftAuction.interface.format("json"),
        address: proxyAddress,
        // args: [],
        // log: true,
    })
};
module.exports.tags = ["auction", "v1", "v2"] 
