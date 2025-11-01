/**task的脚本不能require("hardhat") ，不然会报错
Error HH9: Error while loading Hardhat's configuration.

You probably tried to import the "hardhat" module from your config or a file imported from it.
This is not possible, as Hardhat can't be initialized while its config is being defined.

To learn more about how to access the Hardhat Runtime Environment from different contexts go to https://hardhat.org/hre

For more info go to https://hardhat.org/HH9 or run Hardhat with --show-stack-traces
 */
exports.mintNFT = require("./mint-nft")
exports.nftTransfer = require("./nft-transfer")
exports.checkMTNFT = require("./check-mt-nft")
exports.auctionFactory = require("./auction-factory")
exports.setPriceFeed = require("./set-price-feed")
exports.auctionDeploy = require("./auction-deploy")
exports.endAuction = require("./end-auction")
exports.firstEthBid = require("./first-eth-bid")
exports.secondLinkBid = require("./second-link-bid")
exports.firstUsdcBid = require("./third-usdc-bid")
exports.checkAuction = require("./check-auction")