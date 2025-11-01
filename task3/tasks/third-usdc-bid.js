// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config")
//定义ABI：在任务文件中，仅包含需要使用的函数的ABI。
const USDC_ABI = [
  "function approve(address spender, uint256 value) external returns (bool)",
  "function balanceOf(address owner) external view returns (uint256)",
];
// 将myNFTToken mint到firstAccount
task("third-usdc-bid").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [firstSigner, secondSigner] = await ethers.getSigners()
    const auctionFactory = await ethers.getContractAt("NftAuctionFactory", AUCTION_FACTORY)
    // 根据要出价的nft查询代理合约地址
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, NFT_TOKEN_ID)
    console.log("nftAuctionAddress::", nftAuctionAddress)
    // 实例化代理合约
    let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    const usdcAddr = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"
    const usdcToken = new ethers.Contract(
        usdcAddr, 
        USDC_ABI, 
        firstSigner  // 使用 secondSigner 作为 provider
    )
    // usdc的decimal是6，不是8，要用ethers.parseUnits("3", 18)而不是ethers.parseEther("3")
    const balance = await usdcToken.balanceOf(firstAccount)
    console.log("balance::", balance)
    // 授权nftAuction转移secondSigner的link
    const tx = await usdcToken.connect(firstSigner).approve(nftAuction.target, ethers.MaxUint256)
    await tx.wait(5)
    const bidTx = await nftAuction.connect(firstSigner).bidding(0, usdcAddr, ethers.parseUnits("3", 6)) //3usd
    bidTx.wait(5)

    const auction = await nftAuction.auctionIdAution(0)
    console.log("auction: ",auction)

}) 
// npx hardhat second-link-bid --network sepolia
module.exports = {}