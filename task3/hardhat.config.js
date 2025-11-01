require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("hardhat-deploy")
require("@openzeppelin/hardhat-upgrades")
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require('@nomicfoundation/hardhat-chai-matchers');
require('@nomicfoundation/hardhat-ethers');
require('@typechain/hardhat');
require('hardhat-gas-reporter');
require('solidity-coverage');
require("./tasks"); // require("./tasks/index"); //index.js 
/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2
const ETHER_KEY = process.env.ETHER_KEY
module.exports = {
  solidity: "0.8.20",
  // 默认网络，其他网络用--network参数
  defaultNetwork: "hardhat",
  //设置mocha默认超时，防止因测试网延迟导致mocha报timeout错误
  mocha:{
    timeout: 600*1000 // 600s
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_URL,
      // the private key of your metamask wallet
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2],
      blockConfirmations: 5,
    },
  },
  // verify: {
  //   etherscan: {
  //     // Your API key for Etherscan
  //     // Obtain one at https://etherscan.io/
  //     apiKey: ETHERSCAN_API_KEY,
  //   },
  // },
  // 用来验证合约
  etherscan: {
      apiKey: ETHER_KEY,
  },
  sourcify: {
    enabled: true // 启用 Sourcify 验证
  },
  namedAccounts: {
    firstAccount: {
      default: 0 
    }, 
    secondAccount: {
      default: 1 
    }
  },
  gasReporter: {
    enabled: false,
  },
};
