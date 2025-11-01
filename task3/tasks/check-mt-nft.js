// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")
const { networkConfig,NFT_TOKEN_ID,AUCTION_FACTORY, NFT_ADDRESS } = require("../env-config")
//查询mytoken, myNFTToken的持有者
task("check-mt-nft").setAction(async(taskArgs, hre) => {
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const [signer1, signer2] = await ethers.getSigners()
    // const myToken = await ethers.getContract("MyToken", firstAccount)
    // const myTokenSupply = await myToken.totalSupply()
    // console.log(`myTokenSupply: ${myTokenSupply}`)
    // const firstAccountBalance = await myToken.balanceOf(firstAccount)
    // console.log("firstAccountBalance::",firstAccountBalance)
    // const secondAccountBalance = await myToken.balanceOf(secondAccount)
    // console.log("secondAccountBalance::",secondAccountBalance)

    const myNFTToken = await ethers.getContractAt("MyNFTToken", NFT_ADDRESS)
    const totalSupply = await myNFTToken.totalSupply()
    for(let tokenId=0; tokenId < totalSupply; tokenId++){
        const owner = await myNFTToken.ownerOf(tokenId)
        console.log(`tokenId: ${tokenId} : owner: ${owner}`)
    }
})
// npx hardhat check-mt-nft --network sepolia
module.exports = {}