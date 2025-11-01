// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config");
//定义ABI：在任务文件中，仅包含需要使用的函数的ABI。
const USDC_ABI = [
  "function approve(address spender, uint256 value) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
];
// 将myNFTToken mint到firstAccount
task("check-auction").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory",AUCTION_FACTORY)
    // 根据要出价的nft查询代理合约地址
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    // 实例化代理合约
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    
    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ",auction)
    const priceFeeds = networkConfig[network.config.chainId].priceFeeds
        // 查看喂价
    for(var index in priceFeeds){
        // console.log(priceFeeds[index])
        const { erc20TokenAddress } = priceFeeds[index];
        const priceFeedAddress = await nftAuction.priceFeeds(erc20TokenAddress)
        console.log(`${erc20TokenAddress}::${priceFeedAddress}`)
    }

    const ethPrice = await nftAuction.getChainlinkDataFeedLatestAnswer(ethers.ZeroAddress)
    console.log("ethPrice: ", ethPrice)
    const ethUsdAmount = await nftAuction.convertToUsd(ethers.ZeroAddress, ethers.parseEther("0.00025"))
    console.log("ethUsdAmount: ", ethUsdAmount)

    const linkTokenAddr = "0x779877A7B0D9E8603169DdbD7836e478b4624789"
    const usdcAddr = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    const linkUsdPrice = await nftAuction.getChainlinkDataFeedLatestAnswer(linkTokenAddr)
    console.log("linkUsdPrice: ", linkUsdPrice)
    const linkUsdAmount = await nftAuction.convertToUsd(linkTokenAddr, ethers.parseEther("0.1"))
    console.log("linkUsdAmount: ", linkUsdAmount)

    const usdUsdPrice = await nftAuction.getChainlinkDataFeedLatestAnswer(usdcAddr)
    console.log("usdUsdPrice: ", usdUsdPrice)
    const usdcUsdAmount = await nftAuction.convertToUsd(usdcAddr, ethers.parseUnits("3", 6))
    console.log("usdcUsdAmount: ", usdcUsdAmount)

}) 
// npx hardhat check-auction --network sepolia 
module.exports = {}