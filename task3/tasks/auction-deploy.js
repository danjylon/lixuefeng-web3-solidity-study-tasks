// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
/**
Error HH9: Error while loading Hardhat's configuration.

You probably tried to import the "hardhat" module from your config or a file imported from it.
This is not possible, as Hardhat can't be initialized while its config is being defined.

To learn more about how to access the Hardhat Runtime Environment from different contexts go to https://hardhat.org/hre

For more info go to https://hardhat.org/HH9 or run Hardhat with --show-stack-traces
 */
const {task} = require("hardhat/config")
const { networkConfig } = require("../env-config")
//查询mytoken, myNFTToken的持有者
task("auction-deploy").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const nftAuctionProxy = await ethers.getContract("NftAuctionProxy", firstAccount)
    const myNFTToken = await ethers.getContract("MyNFTToken", firstAccount)
     // 将nft授权给拍卖代理合约
    const tx1 = await myNFTToken.connect(firstSigner).approve(nftAuctionProxy.target, 0)
    await tx1.wait(5)
    // 创建拍卖
    const tx2 = await nftAuctionProxy.connect(firstSigner).createAuction(
        60,
        ethers.parseEther("0.0001"), // 大约0.4usd
        firstAccount,
        myNFTToken.target, // myNFTTokenAddress,
        0
    );
    tx2.wait(5)
    // 获取nft合约地址对应的tokenId为0的拍卖合约实例
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, 0)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    console.log("nftAuction.version", await nftAuction.version())
    console.log("auctionFactory.owner",await auctionFactory.owner())
    // 查看nft的所有人是不是换成代理合约
    const owner2 = await myNFTToken.ownerOf(0)
    console.log("owner2::", owner2)

    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ",auction)

    // 设置喂价
    const priceFeeds = networkConfig[network.config.chainId].priceFeeds
    for(var index in priceFeeds){
        console.log(priceFeeds[index])
        const { erc20TokenAddress, priceFeedAddress } = priceFeeds[index];
        const tx = await nftAuction.connect(firstSigner).setPriceFeed(erc20TokenAddress, priceFeedAddress);
        tx.wait(2)
    }
})
module.exports = {}