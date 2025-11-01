const {ethers, deployments, getNamedAccounts} = require("hardhat")
const {assert, expect} = require("chai")
const {developChains, networkConfig ,INITIAL_ETH_ANSWER, INITIAL_ERC20_ANSWER} = require("../env-config")
let myNFTToken
let myToken
let firstAccount
let secondAccount
let mockV3Aggregator
let mockV3AggregatorErc20
// let mockV3AggregatorLINK
// let mockV3AggregatorUSDC
let nftAuctionProxy
let nftAuction
let firstSigner
let secondSigner
before(async function(){ 
    // 部署所有合约
    await deployments.fixture(["v2"])
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
    nftAuctionProxy = await deployments.get("NftAuctionProxy");
    console.log("NftAuctionProxy.address::", nftAuctionProxy.address)
    // 这里得到的nftAuction实际就是nftAuctionProxy的合约实例
    nftAuction = await ethers.getContractAt("NftAuction", nftAuctionProxy.address)
    // console.log("nftAuction::",nftAuction)
    console.log("nftAuction.target::",nftAuction.target)
    await mockV3Aggregator.waitForDeployment()
    await mockV3AggregatorErc20.waitForDeployment()
    await myNFTToken.waitForDeployment()
    await nftAuction.waitForDeployment()

})
describe("test", async function() {

    // it("mint一个nft，测试owner是否为firstAccount", async function() {
    //     await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    //     const owner = await myNFTToken.ownerOf(0)
    //     console.log("owner1::", owner)
    //     expect(owner).to.equal(firstAccount)
    // })

    // it("设置喂价，查看换算结果", async function() {
    //     const tx1 = await nftAuction.setPriceFeed(ethers.ZeroAddress, mockV3Aggregator.target)
    //     tx1.wait();
    //     const tx2 = await nftAuction.setPriceFeed(myToken.target, mockV3AggregatorErc20.target)
    //     tx2.wait();
    //     const bool1 = await nftAuction.priceFeedsExists(ethers.ZeroAddress)
    //     console.log("bool1: ", bool1)
    //     const bool2 = await nftAuction.priceFeedsExists(myToken.target)
    //     console.log("bool2: ", bool2)
    //     const price1 = await nftAuction.getChainlinkDataFeedLatestAnswer(ethers.ZeroAddress)
    //     console.log("price1: ", price1)
    //     expect(price1).to.equal(INITIAL_ETH_ANSWER)
    //     const price2 = await nftAuction.getChainlinkDataFeedLatestAnswer(myToken.target)
    //     console.log("price2: ", price2)
    //     expect(price2).to.equal(INITIAL_ERC20_ANSWER)
    // })

    // it("mint一个nft，然后创建拍卖", async function() {
    //     await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    //     const owner1 = await myNFTToken.ownerOf(0)
    //     console.log("owner1::", owner1)
    //     // 授权给拍卖合约，这里授权给代理合约
    //     const tx1 = await myNFTToken.approve(nftAuctionProxy.address, 0)
    //     await tx1.wait()
    //     //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
    //     console.log("myNFTToken:",myNFTToken)
    //     // const myNFTTokenAddress = await myNFTToken.getAddress();
    //     const tx2 = await nftAuction.createAuction(
    //         181,
    //         ethers.parseEther("0.001"),
            // firstAccount, 
    //         myNFTToken.target, // myNFTTokenAddress,
    //         0
    //     );
    //     console.log("tx2:",tx2)
    //     console.log("nftAuction.target::", await nftAuction.auctionIdAution(0))
    //     const owner2 = await myNFTToken.ownerOf(0)
    //     console.log("owner2::", owner2)
    //     expect(owner2).to.equal(nftAuctionProxy.address)
    // })

//     it("mint一个nft，然后创建拍卖，然后竞价，第一个出价者出eth，第二个出价者出erc20代币", async function() {
//         // 从firstAccount向secondAccount转100个myToken
//         let tx = await myToken.connect(firstSigner).transfer(secondSigner.address, ethers.parseEther("100"))
//         await tx.wait()
//         const firstSignerBalance = await myToken.balanceOf(firstSigner.address)
//         const secondSignerBalance = await myToken.balanceOf(secondSigner.address)
//         console.log("firstSignerBalance: ",firstSignerBalance)
//         console.log("secondSignerBalance: ",secondSignerBalance)
//         // 向firstAccountmint一个nft
//         await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
//         const owner1 = await myNFTToken.ownerOf(0)
//         console.log("owner1::", owner1)
//         // 授权给拍卖合约，这里授权给代理合约
//         const tx1 = await myNFTToken.approve(nftAuctionProxy.address, 0)
//         await tx1.wait()
//         //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
//         // console.log("myNFTToken:",myNFTToken)
//         // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr
//         const token2Usd =   [{
//             erc20TokenAddress: ethers.ZeroAddress,
//             priceFeedAddr: mockV3Aggregator.target
//         }, {
//             erc20TokenAddress: myToken.target,
//             priceFeedAddr: mockV3AggregatorErc20.target
//         }]

//         for (let i = 0; i < token2Usd.length; i++) {
//             const { erc20TokenAddress, priceFeedAddr } = token2Usd[i];
//             const tx = await nftAuction.setPriceFeed(erc20TokenAddress, priceFeedAddr);
//             tx.wait()
//         }
//         const ethPrice = await nftAuction.priceFeeds(ethers.ZeroAddress)
//         console.log("ethPrice: ", ethPrice)
//         const myTokenPrice = await nftAuction.priceFeeds(myToken.target)
//         console.log("myTokenPrice: ", myTokenPrice)

//         // const myNFTTokenAddress = await myNFTToken.getAddress();
//         const tx2 = await nftAuction.connect(firstSigner).createAuction(
//             30,
//             ethers.parseEther("0.0001"),
            // firstAccount, 
//             myNFTToken.target, // myNFTTokenAddress,
//             0
//         );
//         tx2.wait()
//         console.log("创建拍卖成功auctionIdAution(0)::", await nftAuction.auctionIdAution(0))
//         const owner2 = await myNFTToken.ownerOf(0)
//         console.log("owner2::", owner2)
//         //uint256 _auctionId, address erc20TokenAddress, uint256 erc20Amount
//         // 首先firstAccount竞价，使用eth，喂价4000usd，出价0.00025eth，价值1usd，然后查看auctionIdAution[0]
//         // 使用eth时不用approve，加了payable的方法可以额外传参数 {value: ethers.parseEther("0.00025")
//         const usdAmount = await nftAuction.convertToUsd( ethers.ZeroAddress, ethers.parseEther("0.00025"));
//         console.log("usdAmount1:", usdAmount)
//         const bidTx1 = await nftAuction.connect(firstSigner).bidding(0, ethers.ZeroAddress, 0, {value: ethers.parseEther("0.00025") })
//         bidTx1.wait()
//         const auction1 = await nftAuction.auctionIdAution(0)
//         console.log("auction1::", auction1)
//         // 然后secondAccount竞价，使用mytoken，喂价为20usd，出价0.1，价值2usd，再查看auctionIdAution[0]
//         // 使用erc20 token时，需要approve给nftAuction
//         const bidTx2 = await nftAuction.connect(secondSigner).bidding(0, myToken.target, ethers.parseEther("0.1"))
//         bidTx2.wait()
//         const auction2 = await nftAuction.auctionIdAution(0)
//         console.log("auction2::", auction2)
//         expect(auction1.highestBid).not.equal(auction2.highestBid)
//         expect(auction1.highestBidder).not.equal(auction2.highestBidder)
//     })

    // it("mint一个nft，然后创建拍卖，然后竞价，两个出价者都出erc20代币", async function() {
    //     // 从firstAccount向secondAccount转100个myToken
    //     let tx = await myToken.connect(firstSigner).transfer(secondSigner.address, ethers.parseEther("100"))
    //     await tx.wait()
    //     // 现在firstSigner有900个，secondSigner有100个
    //     // 向firstAccountmint一个nft
    //     await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    //     const owner1 = await myNFTToken.ownerOf(0)
    //     console.log("owner1::", owner1)
    //     // 授权给拍卖合约，这里授权给代理合约
    //     const tx1 = await myNFTToken.approve(nftAuctionProxy.address, 0)
    //     await tx1.wait()
    //     //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
    //     // console.log("myNFTToken:",myNFTToken)
    //     // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr
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

    //     // const myNFTTokenAddress = await myNFTToken.getAddress();
    //     const tx2 = await nftAuction.connect(firstSigner).createAuction(
    //         30,
    //         ethers.parseEther("0.0001"),
            // firstAccount, 
    //         myNFTToken.target, // myNFTTokenAddress,
    //         0
    //     );
    //     tx2.wait()
    //     console.log("创建拍卖成功auctionIdAution(0)::", await nftAuction.auctionIdAution(0))
    //     const owner2 = await myNFTToken.ownerOf(0)
    //     console.log("owner2::", owner2)
    //     //uint256 _auctionId, address erc20TokenAddress, uint256 erc20Amount
    //     // 首先firstAccount竞价，使用eth，喂价4000usd，出价0.00025eth，价值1usd，然后查看auctionIdAution[0]
    //     // 使用eth时不用approve，加了payable的方法可以额外传参数 {value: ethers.parseEther("0.00025")
    //     // const usdAmount = await nftAuction.convertToUsd( ethers.ZeroAddress, ethers.parseEther("0.00025"));
    //     // console.log("usdAmount1:", usdAmount)
    //     // 授权nftAuctionProxy操作firstSigner的erc20代币，在bidding方法中nftAuction合约将firstSigner的erc20代币转到nftAuction合约
    //     const tx3 = await myToken.connect(firstSigner).approve(nftAuctionProxy.address, ethers.MaxUint256)
    //     await tx3.wait()
    //     const bidTx1 = await nftAuction.connect(firstSigner).bidding(0, myToken.target, ethers.parseEther("1"))
    //     bidTx1.wait()
    //     const firstSignerBalance = await myToken.balanceOf(firstSigner.address)
    //     // firstSignerBalance应该是899
    //     console.log("firstSignerBalance: 899 : ",firstSignerBalance)
    //     const nftAuctionBalance = await myToken.balanceOf(nftAuction.target)
    //     // nftAuctionBalance应该是1
    //     console.log("nftAuctionBalance: 1 : ",nftAuctionBalance)

    //     const auction1 = await nftAuction.auctionIdAution(0)
    //     console.log("auction1::", auction1)
    //     // 授权nftAuctionProxy操作secondSigner的erc20代币，在bidding方法中nftAuction合约将secondSigner的erc20代币转到nftAuction合约
    //     const tx4 = await myToken.connect(secondSigner).approve(nftAuctionProxy.address, ethers.MaxUint256)
    //     await tx4.wait()
    //     // 然后secondAccount竞价，使用mytoken，喂价为20usd，出价0.1，价值2usd，再查看auctionIdAution[0]
    //     // 使用erc20 token时，需要approve给nftAuction
    //     const bidTx2 = await nftAuction.connect(secondSigner).bidding(0, myToken.target, ethers.parseEther("2"))
    //     bidTx2.wait()
    //     const secondSignerBalance = await myToken.balanceOf(secondSigner.address)
    //     // secondSignerBalance应该是98
    //     console.log("secondSignerBalance: 98 : ",secondSignerBalance)
    //     const firstSignerBalance2 = await myToken.balanceOf(firstSigner.address)
    //     // firstSignerBalance应该是900
    //     console.log("firstSignerBalance2: 900 : ", firstSignerBalance2)
    //     const nftAuctionBalance2 = await myToken.balanceOf(nftAuction.target)
    //     // nftAuctionBalance应该是2
    //     console.log("nftAuctionBalance2: 2 : ", nftAuctionBalance2)
    //     const auction2 = await nftAuction.auctionIdAution(0)
    //     console.log("auction2::", auction2)
    //     expect(auction1.highestBid).not.equal(auction2.highestBid)
    //     expect(auction1.highestBidder).not.equal(auction2.highestBidder)
    // })

    // it("mint一个nft，然后创建拍卖，没有人出价，过10秒后，结束竞拍", async function() {
    //     // 从firstAccount向secondAccount转100个myToken
    //     let tx = await myToken.connect(firstSigner).transfer(secondSigner.address, ethers.parseEther("100"))
    //     await tx.wait()
    //     // 现在firstSigner有900个，secondSigner有100个
    //     // 向firstAccountmint一个nft
    //     await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
    //     const owner1 = await myNFTToken.ownerOf(0)
    //     console.log("owner1::", owner1)
    //     // 授权给拍卖合约，这里授权给代理合约
    //     const tx1 = await myNFTToken.connect(firstSigner).approve(nftAuctionProxy.address, 0)
    //     await tx1.wait()
    //     //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
    //     // console.log("myNFTToken:",myNFTToken)
    //     // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr
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

    //     // const myNFTTokenAddress = await myNFTToken.getAddress();
    //     const tx2 = await nftAuction.connect(firstSigner).createAuction(
    //         10,
    //         ethers.parseEther("0.0001"),
    //         firstAccount, 
    //         myNFTToken.target, // myNFTTokenAddress,
    //         0
    //     );
    //     tx2.wait()
    //     console.log("创建拍卖成功auctionIdAution(0)::", await nftAuction.auctionIdAution(0))
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

    //     const version = await nftAuction.version()
    //     console.log("version: ",version)
    // })
    
    it("mint一个nft，然后创建拍卖，然后竞价，两个出价者都出erc20代币，过10秒后，结束竞拍", async function() {
        // 从firstAccount向secondAccount转100个myToken
        let tx = await myToken.connect(firstSigner).transfer(secondSigner.address, ethers.parseEther("100"))
        await tx.wait()
        // 现在firstSigner有900个，secondSigner有100个
        // 向firstAccountmint一个nft
        await myNFTToken.safeMint(firstAccount, "ipfs://QmcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n")
        const owner1 = await myNFTToken.ownerOf(0)
        console.log("owner1::", owner1)
        // 授权给拍卖合约，这里授权给代理合约
        const tx1 = await myNFTToken.connect(firstSigner).approve(nftAuctionProxy.address, 0)
        await tx1.wait()
        //uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId
        // console.log("myNFTToken:",myNFTToken)
        // 调用Auction合约的setPriceFeed，address erc20TokenAddress, address priceFeedAddr
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

        // const myNFTTokenAddress = await myNFTToken.getAddress();
        const tx2 = await nftAuction.connect(firstSigner).createAuction(
            10,
            ethers.parseEther("0.0001"),
            firstAccount, 
            myNFTToken.target, // myNFTTokenAddress,
            0
        );
        tx2.wait()
        console.log("创建拍卖成功auctionIdAution(0)::", await nftAuction.auctionIdAution(0))
        const owner2 = await myNFTToken.ownerOf(0)
        console.log("owner2::", owner2)
        //uint256 _auctionId, address erc20TokenAddress, uint256 erc20Amount
        // 首先firstAccount竞价，使用eth，喂价4000usd，出价0.00025eth，价值1usd，然后查看auctionIdAution[0]
        // 使用eth时不用approve，加了payable的方法可以额外传参数 {value: ethers.parseEther("0.00025")
        // const usdAmount = await nftAuction.convertToUsd( ethers.ZeroAddress, ethers.parseEther("0.00025"));
        // console.log("usdAmount1:", usdAmount)
        // 授权nftAuctionProxy操作firstSigner的erc20代币，在bidding方法中nftAuction合约将firstSigner的erc20代币转到nftAuction合约
        const tx3 = await myToken.connect(firstSigner).approve(nftAuctionProxy.address, ethers.MaxUint256)
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
        const tx4 = await myToken.connect(secondSigner).approve(nftAuctionProxy.address, ethers.MaxUint256)
        await tx4.wait()
        // 然后secondAccount竞价，使用mytoken，喂价为20usd，出价0.1，价值2usd，再查看auctionIdAution[0]
        // 使用erc20 token时，需要approve给nftAuction
        const bidTx2 = await nftAuction.connect(secondSigner).bidding(0, myToken.target, ethers.parseEther("2"))
        bidTx2.wait()
        const secondSignerBalance = await myToken.balanceOf(secondSigner.address)
        // secondSignerBalance应该是98
        console.log("secondSignerBalance: 98 : ",secondSignerBalance)
        const firstSignerBalance2 = await myToken.balanceOf(firstSigner.address)
        // firstSignerBalance应该是900
        console.log("firstSignerBalance2: 900 : ", firstSignerBalance2)
        const nftAuctionBalance2 = await myToken.balanceOf(nftAuction.target)
        // nftAuctionBalance应该是2
        console.log("nftAuctionBalance2: 2 : ", nftAuctionBalance2)
        const auction2 = await nftAuction.auctionIdAution(0)
        console.log("auction2::", auction2)

        // 结束拍卖
        // 等待 11 s
        await new Promise((resolve) => setTimeout(resolve, 11 * 1000));
        const tx5 = await nftAuction.endAuction(0)
        tx5.wait()
        const finalOwner = await myNFTToken.ownerOf(0)
        // nft的owner应该是secondAccount
        console.log("finalOwner: ",finalOwner)
        expect(finalOwner).to.equal(secondAccount)
        const firstSignerBalance3 = await myToken.balanceOf(firstSigner.address)
        // firstSignerBalance3应该是902
        console.log("firstSignerBalance3: 902 : ", firstSignerBalance3)
        expect(firstSignerBalance3).to.equal(ethers.parseEther("902"))

        const version = await nftAuction.version()
        console.log("version: ",version)
    })
    
})