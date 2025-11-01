// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config")
// 将myNFTToken mint到firstAccount
task("mint-nft").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    console.log("minting nft....")
    const mintTx = await myNFTToken.safeMint(firstAccount, "ipfs://mcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    await mintTx.wait()
    console.log("nft minted")
}) 
// npx hardhat mint-nft --network sepolia
module.exports = {}