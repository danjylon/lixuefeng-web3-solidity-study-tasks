// const { ethers } = require("hardhat") //这里不能require("hardhat") ，不然会报错
const {task} = require("hardhat/config")

//查询mytoken, myNFTToken的持有者
task("nft-transfer").setAction(async(taskArgs, hre) => {
    const [signer1, signer2] = await ethers.getSigners()
    const {firstAccount, secondAccount} = await getNamedAccounts()
    const myToken = await ethers.getContract("MyToken", firstAccount)

    // firstAccount向secondAccount转200个token
    const tx = await myToken.connect(signer1).transfer(secondAccount, ethers.parseEther("200"))
    tx.wait(3);
})
// npx hardhat mt-transfer --network sepolia
module.exports = {}