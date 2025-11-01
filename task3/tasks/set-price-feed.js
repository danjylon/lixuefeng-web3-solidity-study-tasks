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
task("set-price-feed").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory", AUCTION_FACTORY)
    console.log("auctionFactory::", auctionFactory.target)
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    console.log("myNFTToken.owner::", await myNFTToken.ownerOf(NFT_TOKEN_ID))

    // 获取nft合约地址对应的tokenId为0的拍卖合约实例
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    console.log("nftAuction.version", await nftAuction.version())
    console.log("auctionFactory.owner",await auctionFactory.owner())
    // 查看nft的所有人是不是换成代理合约
    const owner2 = await myNFTToken.ownerOf(NFT_TOKEN_ID)
    console.log("owner2::", owner2)
    console.log("admin: ", await nftAuction.admin())

    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ",auction)

    // 设置喂价
    const priceFeeds = networkConfig[network.config.chainId].priceFeeds
    for(var index in priceFeeds){
        // console.log(priceFeeds[index])
        const { erc20TokenAddress, priceFeedAddress, decimals } = priceFeeds[index];
        // 问题，为什么不生效
        const tx = await nftAuction.connect(firstSigner).setPriceFeed(erc20TokenAddress, priceFeedAddress);
        tx.wait()
    }

})
module.exports = {}