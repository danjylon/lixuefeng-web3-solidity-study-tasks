
const { ethers, deployments, upgrades, getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) => {
    console.log("network.name: ", network.name);
    const {deployer} = await getNamedAccounts();
    const {deploy, save, log} = deployments;

    log("开始升级 NftAuction 合约");

    // 直接从部署记录中获取代理地址
    const nftAuctionProxy = await deployments.get("NftAuctionProxy");

    console.log("升级前代理合约地址：", nftAuctionProxy.address);

    // 验证合约是否是有效的代理
    const implAddress = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
    console.log("升级前实现合约地址：", implAddress);
    
    // 升级合约
    const nftAuctionV2 = await ethers.getContractFactory("NftAuctionV2");
    
    // 根据原始部署类型选择正确的升级方式
    const nftAuctionProxyV2 = await upgrades.upgradeProxy(nftAuctionProxy.address, nftAuctionV2, {
        kind: 'transparent', // kind: 'uups'
        call: "admin"
    });
    
    await nftAuctionProxyV2.waitForDeployment();
    const proxyAddressV2 = await nftAuctionProxyV2.getAddress();
    const implAddressV2 = await upgrades.erc1967.getImplementationAddress(proxyAddressV2);
    
    console.log("升级后的代理合约地址：", proxyAddressV2);
    console.log("升级后的实现合约地址：", implAddressV2);

    // 保存升级后的部署信息
    await save("NftAuctionProxyV2", {
        abi: nftAuctionProxy.abi,
        address: proxyAddressV2,
    });

    log("NftAuction 合约升级成功");
        
};

module.exports.tags = ["auction2", "v2"];
