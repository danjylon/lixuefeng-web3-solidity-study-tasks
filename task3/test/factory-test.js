const {ethers, deployments, getNamedAccounts} = require("hardhat")
const {assert, expect} = require("chai")
const {developChains, networkConfig ,INITIAL_ETH_ANSWER, INITIAL_ERC20_ANSWER} = require("../env-config")
let myNFTToken
let myToken
let firstAccount
let secondAccount
let mockV3Aggregator
let mockV3AggregatorErc20
// let nftAuctionProxy
// let nftAuction
let firstSigner
let secondSigner
let auctionFactory
before(async function(){ 
    // 部署所有合约
    await deployments.fixture(["factory"])
    firstAccount = (await getNamedAccounts()).firstAccount
    secondAccount = (await getNamedAccounts()).secondAccount
    const [signer1, signer2] = await ethers.getSigners()
    firstSigner=signer1
    secondSigner=signer2
    const mockV3AggregatorDeployment = await deployments.get("MockV3Aggregator")
    const mockV3AggregatorErc20Deployment = await deployments.get("MockV3AggregatorErc20")
    // const mockV3AggregatorLINKDeployment = await deployments.get("MockV3AggregatorLINK")
    // const mockV3AggregatorUSDCDeployment = await deployments.get("MockV3AggregatorUSDC")
    const myNFTTokenDeployment = await deployments.get("MyNFTToken")
    const myTokenDeployment = await deployments.get("MyToken")
    mockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", mockV3AggregatorDeployment.address)
    mockV3AggregatorErc20 = await ethers.getContractAt("MockV3AggregatorErc20", mockV3AggregatorErc20Deployment.address)
    console.log("mockV3Aggregator: ",mockV3Aggregator.target)
    console.log("mockV3AggregatorErc20: ",mockV3AggregatorErc20.target)
    myNFTToken = await ethers.getContractAt("MyNFTToken", myNFTTokenDeployment.address)
    myToken = await ethers.getContractAt("MyToken", myTokenDeployment.address)
    // nftAuctionProxy = await deployments.get("NftAuctionProxy");
    // console.log("NftAuctionProxy.address::", nftAuctionProxy.address)
    // // 这里得到的nftAuction实际就是nftAuctionProxy的合约实例
    // nftAuction = await ethers.getContractAt("NftAuction", nftAuctionProxy.address)
    // console.log("nftAuction::",nftAuction)
    const auctionFactoryDeployment = await deployments.get("NftAuctionFactory")
    auctionFactory = await ethers.getContractAt("NftAuctionFactory",auctionFactoryDeployment.address)
    console.log("auctionFactory.target::",auctionFactory.target)
    await mockV3Aggregator.waitForDeployment()
    await mockV3AggregatorErc20.waitForDeployment()
    await myNFTToken.waitForDeployment()
    await auctionFactory.waitForDeployment()

})
describe("test", async function() {

    // it("mint一个nft，测试没有人竞拍，10秒后结束竞拍", async function() {

    //     // 向firstAccountmint一个nft
    //     await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    //     const owner1 = await myNFTToken.ownerOf(0)
    //     console.log("owner1::", owner1)
    //     // 授权给拍卖合约，这里授权给合约工厂
    //     const tx1 = await myNFTToken.connect(firstSigner).approve(auctionFactory.target, 0)
    //     await tx1.wait()
    //     //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
    //     // console.log("myNFTToken:",myNFTToken)
    //     // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr

    //     const tx2 = await auctionFactory.connect(firstSigner).createAuction(
    //         10,
    //         ethers.parseEther("0.0001"),
    //         myNFTToken.target, // myNFTTokenAddress,
    //         0
    //     );
    //     tx2.wait()
    //     const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, 0)
    //     console.log("nftAuctionAddress::", nftAuctionAddress)
    //     let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
    //     console.log("nftAuction.version", await nftAuction.version())

    //     console.log("auctionFactory.owner",await auctionFactory.owner())
    //     const token2Usd =   [{
    //         erc20TokenAddress: ethers.ZeroAddress,
    //         priceFeedAddr: mockV3Aggregator.target
    //     }, {
    //         erc20TokenAddress: myToken.target,
    //         priceFeedAddr: mockV3AggregatorErc20.target
    //     }]

    //     for (let i = 0; i < token2Usd.length; i++) {
    //         const { erc20TokenAddress, priceFeedAddr } = token2Usd[i];
    //         const tx = await nftAuction.setPriceFeed(erc20TokenAddress, priceFeedAddr);
    //         tx.wait()
    //     }
    //     const ethPrice = await nftAuction.priceFeeds(ethers.ZeroAddress)
    //     console.log("ethPrice: ", ethPrice)
    //     const myTokenPrice = await nftAuction.priceFeeds(myToken.target)
    //     console.log("myTokenPrice: ", myTokenPrice)
    //     const owner2 = await myNFTToken.ownerOf(0)
    //     console.log("owner2::", owner2)
    //     // 结束拍卖
    //     // 等待 11 s
    //     await new Promise((resolve) => setTimeout(resolve, 11 * 1000));
    //     const tx5 = await nftAuction.connect(firstSigner).endAuction(0)
    //     tx5.wait()
    //     const finalOwner = await myNFTToken.ownerOf(0)
    //     // nft的owner应该是firstAccount
    //     console.log("finalOwner: ",finalOwner)
    //     expect(finalOwner).to.equal(firstAccount)

    // })

    it("mint一个nft，然后使用工厂创建拍卖，然后竞价，两个出价者都出erc20代币，过10秒后，结束竞拍", async function() {
        // 从firstAccount向secondAccount转100个myToken
        let tx = await myToken.connect(firstSigner).transfer(secondSigner.address, ethers.parseEther("100"))
        await tx.wait()
        // 向firstAccountmint一个nft
        await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
        const owner1 = await myNFTToken.ownerOf(0)
        console.log("owner1::", owner1)
        // 授权给拍卖合约，这里授权给合约工厂
        const tx1 = await myNFTToken.connect(firstSigner).approve(auctionFactory.target, 0)
        await tx1.wait()
        //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
        // console.log("myNFTToken:",myNFTToken)
        // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr

        const tx2 = await auctionFactory.connect(firstSigner).createAuction(
            10,
            ethers.parseEther("0.0001"),
            myNFTToken.target, // myNFTTokenAddress,
            0
        );
        tx2.wait()
        const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, 0)
        console.log("nftAuctionAddress::", nftAuctionAddress)
        let nftAuction = await ethers.getContractAt("NftAuction", nftAuctionAddress)
        console.log("nftAuction.version", await nftAuction.version())

        console.log("auctionFactory.owner",await auctionFactory.owner())
        const token2Usd =   [{
            erc20TokenAddress: ethers.ZeroAddress,
            priceFeedAddr: mockV3Aggregator.target
        }, {
            erc20TokenAddress: myToken.target,
            priceFeedAddr: mockV3AggregatorErc20.target
        }]

        for (let i = 0; i < token2Usd.length; i++) {
            const { erc20TokenAddress, priceFeedAddr } = token2Usd[i];
            const tx = await nftAuction.setPriceFeed(erc20TokenAddress, priceFeedAddr);
            tx.wait()
        }
        const ethPrice = await nftAuction.priceFeeds(ethers.ZeroAddress)
        console.log("ethPrice: ", ethPrice)
        const myTokenPrice = await nftAuction.priceFeeds(myToken.target)
        console.log("myTokenPrice: ", myTokenPrice)
        const owner2 = await myNFTToken.ownerOf(0)
        console.log("owner2::", owner2)


        //uint256 _auctionId, address erc20TokenAddress, uint256 erc20Amount
        // 首先firstAccount竞价，使用eth，喂价4000usd，出价0.00025eth，价值1usd，然后查看auctionIdAution[0]
        // 使用eth时不用approve，加了payable的方法可以额外传参数 {value: ethers.parseEther("0.00025")
        // const usdAmount = await nftAuction.convertToUsd( ethers.ZeroAddress, ethers.parseEther("0.00025"));
        // console.log("usdAmount1:", usdAmount)
        // 授权nftAuctionProxy操作firstSigner的erc20代币，在bidding方法中nftAuction合约将firstSigner的erc20代币转到nftAuction合约
        const tx3 = await myToken.connect(firstSigner).approve(nftAuction.target, ethers.MaxUint256)
        await tx3.wait()
        const bidTx1 = await nftAuction.connect(firstSigner).bidding(0, myToken.target, ethers.parseEther("1"))
        bidTx1.wait()
        const firstSignerBalance = await myToken.balanceOf(firstSigner.address)
        // firstSignerBalance应该是899
        console.log("firstSignerBalance: 899 : ",firstSignerBalance)
        const nftAuctionBalance = await myToken.balanceOf(nftAuction.target)
        // nftAuctionBalance应该是1
        console.log("nftAuctionBalance: 1 : ",nftAuctionBalance)

        const auction1 = await nftAuction.auctionIdAution(0)
        console.log("auction1::", auction1)
        // 授权nftAuctionProxy操作secondSigner的erc20代币，在bidding方法中nftAuction合约将secondSigner的erc20代币转到nftAuction合约
        const tx4 = await myToken.connect(secondSigner).approve(nftAuction.target, ethers.MaxUint256)
        await tx4.wait()
        // 然后secondAccount竞价，使用mytoken，喂价为20usd，出价0.1，价值2usd，再查看auctionIdAution[0]
        // 使用erc20 token时，需要approve给nftAuction
        const bidTx2 = await nftAuction.connect(secondSigner).bidding(0, myToken.target, ethers.parseEther("2"))
        bidTx2.wait()

        // 结束拍卖
        // 等待 11 s
        await new Promise((resolve) => setTimeout(resolve, 11 * 1000));
        const tx5 = await nftAuction.connect(firstSigner).endAuction(0)
        tx5.wait()
        const finalOwner = await myNFTToken.ownerOf(0)
        // nft的owner应该是firstAccount
        console.log("finalOwner: ",finalOwner)
        expect(finalOwner).to.equal(secondSigner)



        // let nftAuctionV2Factory = await ethers.getContractFactory("NftAuctionV2")
        // let nftAuctionV2 = await nftAuctionV2Factory.connect(firstSigner).deploy() 
        // console.log("nftAuctionV2:", nftAuctionV2.target)
        // const tx = await nftAuctionV2.initialize(firstAccount)
        // tx.wait()
        // console.log("admin: ",await nftAuctionV2.admin())
        // const owner = await auctionFactory.upgradeAuction(nftAuction, nftAuctionV2)
        // console.log("owner: ",owner)

        // // 获取 ProxyAdmin 合约实例
        // const proxyAdminAddress = await auctionFactory.proxyAdmin(); // 获取 ProxyAdmin 地址
        // const proxyAdmin = await ethers.getContractAt("ProxyAdmin", proxyAdminAddress); // 实例化 ProxyAdmin

        // // 获取代理合约地址
        // const nftAuctionAddress = await auctionFactory.getAuction(myNFTToken.target, 0);

        // // 获取 NftAuctionV2 合约地址
        // const nftAuctionV2Factory = await ethers.getContractFactory("NftAuctionV2");
        // const nftAuctionV2 = await nftAuctionV2Factory.deploy();
        // await nftAuctionV2.waitForDeployment();
        // console.log("nftAuctionV2:", nftAuctionV2.target)
        // // const tx = await nftAuctionV2.initialize(firstAccount)
        // // tx.wait()
        // // console.log("admin: ", await nftAuctionV2.admin())
        // // const initializeData = nftAuctionV2.interface.encodeFunctionData("initialize", [firstAccount]);
        // // 直接调用 ProxyAdmin 的 upgradeAndCall 函数
        // await proxyAdmin.connect(firstSigner).upgradeAndCall(
        //     nftAuctionAddress, // 代理合约地址
        //     nftAuctionV2.target, // 新实现合约地址
        //     "0x"// 初始化数据（可为空）
        // );
    })
})
