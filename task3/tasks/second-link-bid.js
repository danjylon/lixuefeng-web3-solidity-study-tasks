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
//定义ABI：在任务文件中，仅包含需要使用的函数的ABI。
const LINK_TOKEN_ABI = [
  "function approve(address spender, uint256 value) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
  // "function transfer(address to, uint256 value) external returns (bool)"
];
// 将myNFTToken mint到firstAccount
task("second-link-bid").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory", AUCTION_FACTORY)
    // 根据要出价的nft查询代理合约地址
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    // 实例化代理合约
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    const linkTokenAddr = "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    // const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddr)
     // 使用 ABI 创建 LinkToken 合约实例
     // 问题：为什么await ethers.getContractAt("LinkToken", linkTokenAddr)不行
    const linkToken = new ethers.Contract(
        linkTokenAddr, 
        LINK_TOKEN_ABI, 
        secondSigner  // 使用 secondSigner 作为 provider
    )
    const balance = await linkToken.balanceOf(secondAccount)
    console.log("balance::", balance)
    // 授权nftAuction转移secondSigner的link
    const tx = await linkToken.connect(secondSigner).approve(nftAuction.target, ethers.MaxUint256)
    await tx.wait(5)
    const priceFeedAddress = await nftAuction.priceFeeds(linkTokenAddr)
    console.log(`${linkTokenAddr}::${priceFeedAddress}`)
    const bidTx = await nftAuction.connect(secondSigner).bidding(0, linkTokenAddr, ethers.parseEther("0.1")) //大约2usd
    bidTx.wait(5)

    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ",auction)

}) 
// npx hardhat second-link-bid --network sepolia
module.exports = {}