# 单元测试
## 透明代理升级
npx hardhat test ./test/auction-test.js
## 工厂模式
npx hardhat test ./test/factory-test.js
## 单元测试覆盖率
npx hardhat coverage --show-stack-traces 
----------------------------|----------|----------|----------|----------|----------------|
File                        |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------------------------|----------|----------|----------|----------|----------------|
 contracts\                 |    87.69 |    51.85 |       76 |    86.36 |                |
  MyNFTToken.sol            |     62.5 |       50 |       50 |     62.5 |       51,60,69 |
  MyToken.sol               |       50 |        0 |       50 |       50 |             36 |
  NftAuction.sol            |    93.33 |    54.55 |    92.31 |    90.63 |... 237,267,268 |
  NftAuctionFactory.sol     |      100 |       50 |      100 |    92.31 |             62 |
  NftAuctionV2.sol          |        0 |      100 |        0 |        0 |              9 |
 contracts\mocks\           |      100 |      100 |      100 |      100 |                |
  MockV3Aggregator.sol      |      100 |      100 |      100 |      100 |                |
  MockV3AggregatorErc20.sol |      100 |      100 |      100 |      100 |                |
----------------------------|----------|----------|----------|----------|----------------|
All files                   |    87.69 |    51.85 |    76.92 |    86.36 |                |
----------------------------|----------|----------|----------|----------|----------------|
# sepolia部署+执行任务
## 部署nft合约，并mint一个nft到firstAccount
npx hardhat deploy --tags nft --network sepolia --reset

npx hardhat mint-nft --network sepolia
## 查询nft tokenId的owner
npx hardhat check-mt-nft --network sepolia

## 部署拍卖工厂合约
npx hardhat deploy --tags factoryDeploy --network sepolia --reset

## 创建拍卖合约，以0.0001eth起拍，限时6分钟，nft由firstAccount的钱包转到拍卖合约的地址
npx hardhat auction-factory --network sepolia
## 设置喂价
npx hardhat set-price-feed --network sepolia
## 竞拍
### 首先firstAccount以0.00025eth出价
npx hardhat first-eth-bid --network sepolia
### 然后secondAccount以0.1Link出价
npx hardhat second-link-bid --network sepolia
### 最后firstAccount以3usdc出价
npx hardhat third-usdc-bid --network sepolia
## 结束拍卖，nft从拍卖合约的地址转到firstAccount
npx hardhat end-auction --network sepolia


