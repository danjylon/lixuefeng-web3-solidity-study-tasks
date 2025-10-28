// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
/**
### 1. 创建一个名为Voting的合约，包含以下功能：
- 一个mapping来存储候选人的得票数
- 一个vote函数，允许用户投票给某个候选人
- 一个getVotes函数，返回某个候选人的得票数
- 一个resetVotes函数，重置所有候选人的得票数
*/

contract Voting {

    mapping(string => uint256) public candidateVotes;
    mapping(string => bool) public isCandidate;
    string[] public candidates;
		// 构造器，初始化时传入一个数组，包含所有候选人的姓名
    // constructor, pass an array includes candidates'names into the constructor while deploying the contract 
    constructor(string[] memory _candidates) {
        for(uint i = 0; i<_candidates.length; i++){
            candidates.push(_candidates[i]);
            isCandidate[_candidates[i]]=true;
        }
    }
    function vote(string memory _candidate) public {
        require(isCandidate[_candidate], unicode"您输入的候选人姓名有误");
        if(isCandidate[_candidate]){
            candidateVotes[_candidate] += 1;
        }
    }

    function getVotes(string memory _candidate) public view returns (uint256) {
        return candidateVotes[_candidate];
    }

    function resetVotes() public {
        for(uint i = 0;i<candidates.length;i++){
            candidateVotes[candidates[i]] = 0;
        }
    }

}