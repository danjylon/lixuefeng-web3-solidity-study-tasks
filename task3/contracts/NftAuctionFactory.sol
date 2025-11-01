// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;
// 问题，怎么升级，每次拍卖合约升级后这里引入的NftAuction.sol还要变化吗，这个工厂合约要改吗，工厂合约也要用代理升级？
import {NftAuction} from "./NftAuction.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// 问题：使用工厂模式后，是每个拍卖都是创建一个新的拍卖合约吗，即一个合约对应一次拍卖？
contract NftAuctionFactory {
    address public owner;
    mapping(address => mapping(uint256 => NftAuction)) public nftContractAuctionContractMap;
    mapping(address => bool) public nftContractExists;

    constructor() {
        owner = msg.sender;
    }

    // 创建新拍卖（使用透明代理）
    function createAuction(
        uint256 _auctionDuration,
        uint256 _startingBid,
        address _nftContract,
        uint256 _tokenId
    ) external {
        require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "Not owner of NFT");
        require(_auctionDuration > 5, "Duration too short");

        // 1. 部署实现合约（NftAuction逻辑）
        NftAuction nftAuction = new NftAuction();
        nftAuction.initialize(msg.sender);

        // 设置喂价
        //eth
        // nftAuction.setPriceFeed(address(0), 0x694AA1769357215DE4FAC081bf1f309aDC325306);
        // //link
        // nftAuction.setPriceFeed(0x779877A7B0D9E8603169DdbD7836e478b4624789, 0xc59E3633BAAC79493d908e63626716e204A45EdF);
        // //usdc
        // nftAuction.setPriceFeed(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E);
        
        // 5. 转移 NFT 到拍卖合约,
        // 问题：这个操作是否应该由工厂来做
        IERC721(_nftContract).transferFrom(
            msg.sender,
            address(nftAuction),
            _tokenId
        );
        
        //6. 创建拍卖
        // 问题：这个创建拍卖应该由谁来执行，是工厂合约还是拍卖合约？
        // 问题：函数调用者问题，这里要手动传入msg.sender，拍卖合约应不应该因为工厂合约而改变代码？
        nftAuction.createAuction(
            _auctionDuration,
            _startingBid,
            msg.sender,
            _nftContract,
            _tokenId
        );
        
        // 7. 记录合约
        bool exists = nftContractExists[_nftContract];
        if (exists) {
            nftContractAuctionContractMap[_nftContract][_tokenId] = nftAuction;
        } else {
            nftContractAuctionContractMap[_nftContract][_tokenId] = nftAuction;
            nftContractExists[_nftContract] = true;
        }
    }

    function getAuction(address nftContractAddress, uint256 tokenId) external view returns (NftAuction) {
        return nftContractAuctionContractMap[nftContractAddress][tokenId];
    }
}
