// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config")
// 将myNFTToken mint到firstAccount
task("first-eth-bid").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory",AUCTION_FACTORY)
    // 根据要出价的nft查询代理合约地址
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
     console.log("auctionFactory::", auctionFactory.target)
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    // 实例化代理合约
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    const bidTx = await nftAuction.connect(firstSigner).bidding(0, ethers.ZeroAddress, 0,  {value: ethers.parseEther("0.00025")}) //大约1usd
    bidTx.wait(5)

    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ", auction)

}) 
// npx hardhat first-eth-bid --network sepolia
module.exports = {}