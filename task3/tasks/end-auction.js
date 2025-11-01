// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
/**
Error HH9: Error while loading Hardhat's configuration.

You probably tried to import the "hardhat" module from your config or a file imported from it.
This is not possible, as Hardhat can't be initialized while its config is being defined.

To learn more about how to access the Hardhat Runtime Environment from different contexts go to https://hardhat.org/hre

For more info go to https://hardhat.org/HH9 or run Hardhat with --show-stack-traces
 */
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config")
//查询mytoken, myNFTToken的持有者
task("end-auction").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory", AUCTION_FACTORY)
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)

    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    console.log("nftAuction.version", await nftAuction.version())
    // 查看nft的所有人是不是代理合约
    const owner1 = await myNFTToken.ownerOf(NFT_TOKEN_ID)
    console.log("owner1::", owner1)
    // 结束拍卖
    const tx = await nftAuction.endAuction(0)
    tx.wait(10)
    // 查看nft的所有人是不是firstAccount
    const owner2 = await myNFTToken.ownerOf(NFT_TOKEN_ID)
    console.log("owner2::", owner2)
})
module.exports = {}