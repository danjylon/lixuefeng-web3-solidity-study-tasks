// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20; 
// pragma solidity >=0.8.27 <0.8.30;
import {MockV3Aggregator} from "@chainlink/contracts/src/v0.8/shared/mocks/MockV3Aggregator.sol";
// write a deploy script in deploy named 00-deploy-mock.js
contract MockV3AggregatorErc20 is MockV3Aggregator{

    constructor(uint8 _decimals, int256 _initialAnswer) MockV3Aggregator(_decimals,_initialAnswer){
       
    }
}