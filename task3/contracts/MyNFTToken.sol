// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.20;
// pragma solidity >=0.8.27 <0.8.30;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// 保证合约里的token可以被枚举查看
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// 用来储存metadata，记录这些token的描述信息、特性，但这些metadata一般不会存在ethereum中，因为ethereum不能支撑这么大的数据量，所以采用去中心化存储的网络来存储
// IPFS是一种协议，用于存储去中心化数据的协议，很多厂商基于该协议开发了去中心化存储的网络，比如filebase
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract MyNFTToken is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    // 使用filebase创建一个bucket，然后上传一个图片，把图片的IPFS Gateway URL复制过来
    // string constant META_DATA = "ipfs://mcjBk3BvtxmSoav9ZUqitRe4v1nSzkFcvGXL3eywUCA2n";

    constructor(string memory tokenName, string memory tokenSymbol)
        ERC721(tokenName, tokenSymbol)
        Ownable(msg.sender)
    {}
    
    // 将NFT铸造到to这个地址
    function safeMint(address to, string memory metaDataUri)// , string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        // _setTokenURI(tokenId, uri);
        _setTokenURI(tokenId, metaDataUri);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
