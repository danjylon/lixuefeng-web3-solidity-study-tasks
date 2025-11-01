// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;

import {NftAuction} from "./NftAuction.sol";
contract NftAuctionV2 is NftAuction {

    function version() public pure override returns(string memory) {
        return "NftAuctionV2";
    }
}
// import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol"; //透明代理
// // import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
// import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
// import {console} from "hardhat/console.sol";
// import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
// import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// contract NftAuctionV2 is Initializable, AccessControl {//, UUPSUpgradeable  {
//     // 结构体
//     struct Auction{
//         // 卖家
//         address seller;
//         // 拍卖开始时间
//         uint256 startTime;
//         // 拍卖持续时间
//         uint256 auctionDuration;
//         // 起拍价
//         uint256 startingBid;
//         // 最高出价
//         uint256 highestBid;
//         // 最高出价者
//         address highestBidder;
//         // nft合约地址
//         address nftContract;
//         // nft的tokenId，通过nft合约地址和tokenId可以确定到那个具体的NFT
//         uint256 tokenId;
//         // 参与竞价的货币类型，0x表示eth，其他地址表示ERC20通证
//         address tokenAddress;
//         // 竞拍是否结束标志
//         bool ended;
//     }
//     uint256 public auctionId;

//     mapping (uint256 => Auction) public auctionIdAution;
//     // 拍卖管理员
//     address public admin;
//     // bytes32 public constant ADMIN = keccak256("ADMIN");
//     address public owner;

//     mapping(address=>AggregatorV3Interface) public priceFeeds;
//     mapping(address => bool) public priceFeedsExists;
    
//     // constructor(){
//     //     owner = msg.sender;
//     // }

//     // 如果使用Initializable进行合约升级，而且使用AccessControl进行权限管理的话，要在initialize中进行权限配置，不能再constructor中进行权限配置
//     // initializer 修饰符确保 initialize 函数只能被调用一次
//     // 问题：如何保证initialize的调用权限？不用保证，initialize方法只能调用一次，而通常是在部署的时候调用，也就是部署者调用，那么就能保证只有部署者能调用initialize
//     function initialize(address _admin) public initializer  {
//         owner = msg.sender;
//         admin = _admin;
//         // _grantRole(DEFAULT_ADMIN_ROLE, _admin);
//     }

//     /* sepolia
//     eth->usd erc20TokenAddress: 0x0000000000000000000000000000000000000000, priceFeedAddr: 0x694AA1769357215DE4FAC081bf1f309aDC325306, 393890988244
//     LINK->usd erc20TokenAddress: 0x779877A7B0D9E8603169DdbD7836e478b4624789, priceFeedAddr: 0xc59E3633BAAC79493d908e63626716e204A45EdF, 1842563497
//     usdc->usd erc20TokenAddress: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, priceFeedAddr: 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, 99984973
//     */
//     // 问题，如果将erc20和priceFeedAddr的对应关系搞错了怎么办？
//     function setPriceFeed(address erc20TokenAddress, address priceFeedAddr) public 
//     // onlyRole(DEFAULT_ADMIN_ROLE) 
//     onlyAdmin
//     {
//         AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddr);
//         priceFeeds[erc20TokenAddress] = priceFeed;
//         priceFeedsExists[erc20TokenAddress] = true;
//     }

//     // Returns the latest answer.
//     function getChainlinkDataFeedLatestAnswer(address erc20TokenAddress) public view returns (int) {
//         AggregatorV3Interface priceFeed = priceFeeds[erc20TokenAddress];
//         // data deconstruct
//         (
//             // uint80 roundId 
//             ,
//             int256 answer,
//             //uint256 startedAt
//             ,
//             //uint256 updatedAt
//             ,
//             //uint80 answeredInRound
//         ) = priceFeed.latestRoundData();
//         return answer;
//     }

//     function convertToUsd(address erc20TokenAddress, uint256 amount) internal view returns (uint256){
//         // 获取喂价
//         uint256 usdPrice = uint256(getChainlinkDataFeedLatestAnswer(erc20TokenAddress));
//         // 
//         uint256 usdAmount = amount  * usdPrice;
//         return usdAmount;// /(10**8); 
//     }

//     //创建拍卖
//     function createAuction(uint256 _auctionDuration, uint256 _startingBid, address _nftContract, uint256 _tokenId) public 
//     // 如果只有管理员能创建拍卖，那卖家需要先把nft转给admin，需要先approve在transfer，然后admin再来创建拍卖，从admin的账户把nft转到该合约
//     // 如果是人人都可以直接创建拍卖，那就是直接从卖家的账户把nft转到该合约
//     onlyAdmin 
//     // onlyRole(DEFAULT_ADMIN_ROLE)
//     // 起拍价大于0
//     startingBidGreaterThanZero(_startingBid) 
//     // 竞拍持续时间要大于某个时间，这里大于3分钟
//     auctionDurationGreaterThanThreeMinites(_auctionDuration)
//     {
//         // 实例化要拍卖的nft，并将nft转入该拍卖合约中
//         IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId); //使用safeTransferFrom需要实现IERC721Receiver的onERC721Received接口
//         // IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
//         // nft转账成功后，保存该竞拍信息
//         Auction memory auction = Auction({
//             seller: msg.sender,
//             startTime: block.timestamp,
//             auctionDuration: _auctionDuration,
//             startingBid: _startingBid,
//             highestBid: _startingBid,
//             highestBidder: address(0),
//             nftContract:_nftContract,
//             tokenId: _tokenId,
//             tokenAddress: address(0),
//             ended: false
//         });
//         auctionIdAution[auctionId] = auction;
//         auctionId++;
//     }

//     modifier onlyOwner(){
//         require(msg.sender==owner, "Only owner allowed to create an auction");
//         _;
//     }

//     modifier onlyAdmin() {
//         require(msg.sender==admin, "Only admin allowed to create an auction");
//         _;
//     }

//     modifier startingBidGreaterThanZero(uint256 _startingBid){
//         require(_startingBid > 0, "Starting bid must greater than 0");
//         _;
//     }

//     modifier auctionDurationGreaterThanThreeMinites(uint256 _auctionDuration){
//         require(_auctionDuration > 3 * 60, "Auction duration must greater than 3 minites");
//         _;
//     }

//     // 竞拍
//     function bidding(uint256 _auctionId, address erc20TokenAddress, uint256 erc20Amount) public payable 
//     // 出价大于起拍价，大于最高价
//     // 时间窗口内，竞拍未结束
//     {
//         require(priceFeedsExists[erc20TokenAddress], "Your ERC20 token is not supported to bid");
//         Auction storage auction = auctionIdAution[_auctionId];
        
//         require(!auction.ended && block.timestamp < auction.auctionDuration + auction.startTime, "Auction ends");
//         // TODO 喂价，价格转换，eth转为usd，erc20转为usd
//         uint256 amount;
//         uint256 usdAmount;
//         if(erc20TokenAddress == address(0)){
//             // 转的是eth
//             amount = msg.value;
//             usdAmount = convertToUsd(address(0), amount);
//         }else {
//             //转的是erc20
//             amount = erc20Amount;
//             usdAmount = convertToUsd(erc20TokenAddress, amount);
//         }
        
//         require(msg.value > auction.startingBid && msg.value > auction.highestBid, "Your bidding is too low");
//         auction.highestBid = msg.value;
//         auction.highestBidder = msg.sender;
//         auction.tokenAddress = erc20TokenAddress;
//         // auctionIdAution[_auctionId] = auction;
//     }

//     // 结束竞拍
//     // 问题：有没有定时任务的实现方法
//     function endAuction(uint256 _auctionId) public 
//     // onlyRole(DEFAULT_ADMIN_ROLE) 
//     onlyAdmin
//     {
//         Auction storage auction = auctionIdAution[_auctionId];
//         require(block.timestamp >= auction.auctionDuration + auction.startTime, "Time is not up yet, Auction ends failed");
//         // 实例化要拍卖的nft，并将nft从seller转入最高出价者的钱包
//         IERC721(auction.nftContract).safeTransferFrom(auction.seller, auction.highestBidder, auction.tokenId);
//         // 将eth或erc20从本合约转入seller的钱包中
//         if(auction.tokenAddress == address(0)){
//             //eth，从本合约将拍卖的eth转给seller
//             payable(auction.seller).transfer(auction.highestBid);
//         } else {
//             // erc20，将拍卖收到的erc20转给selleer
//             IERC20(auction.tokenAddress).transferFrom(address(this), auction.seller, auction.highestBid);
//         }
//         auction.ended = true;
//     }

//     function version() public pure virtual returns(string memory) {
//         return "NftAuctionV2";
//     }

//     // function _authorizeUpgrade(address) internal view override {
//     //     // 只有管理员可以升级合约
//     //     require(msg.sender == admin, "Only admin can upgrade");
//     // }
    
//     // 实现 IERC721Receiver 接口
//     function onERC721Received(
//         address, 
//         address, 
//         uint256, 
//         bytes calldata
//     ) public pure returns (bytes4) {
//         return IERC721Receiver.onERC721Received.selector;
//     }
// }