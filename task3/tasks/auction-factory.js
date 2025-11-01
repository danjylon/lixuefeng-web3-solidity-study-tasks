// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
/**
Error HH9: Error while loading Hardhat's configuration.

You probably tried to import the "hardhat" module from your config or a file imported from it.
This is not possible, as Hardhat can't be initialized while its config is being defined.

To learn more about how to access the Hardhat Runtime Environment from different contexts go to https://hardhat.org/hre

For more info go to https://hardhat.org/HH9 or run Hardhat with --show-stack-traces
 */
const {task} = require("hardhat/config")
const { networkConfig ,NFT_TOKEN_ID, AUCTION_FACTORY, NFT_ADDRESS} = require("../env-config")
//查询mytoken, myNFTToken的持有者
task("auction-factory").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory", AUCTION_FACTORY)
    console.log("auctionFactory::", auctionFactory.target)
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    console.log("myNFTToken.owner::", await myNFTToken.ownerOf(NFT_TOKEN_ID))

    // 将nft授权给拍卖合约，这里授权给合约工厂
    const tx1 = await myNFTToken.connect(firstSigner).approve(auctionFactory.target, NFT_TOKEN_ID)
    await tx1.wait(6)
    console.log("createAuction...")
    // 创建拍卖
    const tx2 = await auctionFactory.connect(firstSigner).createAuction(
        360,
        ethers.parseEther("0.0001"), // 大约0.4usd
        myNFTToken.target, // myNFTTokenAddress,
        NFT_TOKEN_ID
    );
    // 这里要等的足够久，不然下一步得到的nftAuctionAddress是0地址
    // 问题：为什么这里的tx2.wait(10)不生效
    tx2.wait(10)
    console.log("createAuction done")


})
module.exports = {}