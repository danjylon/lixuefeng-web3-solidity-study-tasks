// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
/*
✅ 作业3：编写一个讨饭合约
任务目标
使用 Solidity 编写一个合约，允许用户向合约地址发送以太币。
记录每个捐赠者的地址和捐赠金额。
允许合约所有者提取所有捐赠的资金。

任务步骤
1、编写合约
创建一个名为 BeggingContract 的合约。
合约应包含以下功能：
一个 mapping 来记录每个捐赠者的捐赠金额。
一个 donate 函数，允许用户向合约发送以太币，并记录捐赠信息。
一个 withdraw 函数，允许合约所有者提取所有资金。
一个 getDonation 函数，允许查询某个地址的捐赠金额。
使用 payable 修饰符和 address.transfer 实现支付和提款。
2、部署合约
在 Remix IDE 中编译合约。
部署合约到 Goerli 或 Sepolia 测试网。
3、测试合约
使用 MetaMask 向合约发送以太币，测试 donate 功能。
调用 withdraw 函数，测试合约所有者是否可以提取资金。
调用 getDonation 函数，查询某个地址的捐赠金额。

任务要求
1、合约代码：
使用 mapping 记录捐赠者的地址和金额。
使用 payable 修饰符实现 donate 和 withdraw 函数。
使用 onlyOwner 修饰符限制 withdraw 函数只能由合约所有者调用。
2、测试网部署：
合约必须部署到 Goerli 或 Sepolia 测试网。
3、功能测试：
确保 donate、withdraw 和 getDonation 函数正常工作。

提交内容
1、合约代码：提交 Solidity 合约文件（如 BeggingContract.sol）。
3、合约地址：提交部署到测试网的合约地址。
3、测试截图：提交在 Remix 或 Etherscan 上测试合约的截图。

额外挑战（可选）
1、捐赠事件：添加 Donation 事件，记录每次捐赠的地址和金额。
2、捐赠排行榜：实现一个功能，显示捐赠金额最多的前 3 个地址。
3、时间限制：添加一个时间限制，只有在特定时间段内才能捐赠。
*/
contract BeggingContract {

    mapping(address=>uint256) donatorAmount;
    address private owner;
    uint256 public deployAt;
    uint256 constant public lockDuration = 3*60;
    address[] public topThreeDonators;

    event Donation(address indexed donator, uint256 amount);

    constructor(){
        owner = msg.sender;
        deployAt = block.timestamp;
    }

    function donate() payable public timeWindowClosed minDonateAmount {
        donatorAmount[msg.sender]+=msg.value;
        if(topThreeDonators.length<3){
            topThreeDonators.push(msg.sender);
        } else{
            uint256 minAmountIndex = 0;
            uint256 minAmount = donatorAmount[topThreeDonators[minAmountIndex]];
            for(uint256 i=1;i<topThreeDonators.length;i++){
                if(minAmount>donatorAmount[topThreeDonators[i]]){
                    minAmount = donatorAmount[topThreeDonators[i]];
                    minAmountIndex = i;
                }
            }
            if(donatorAmount[msg.sender]>minAmount){
                topThreeDonators[minAmountIndex] = msg.sender;
            }
        }
        emit Donation(msg.sender, msg.value);
    }

    function withdraw() public onlyOnwer {
        payable(owner).transfer(address(this).balance);
    }

    modifier minDonateAmount(){
        require(msg.value>0, unicode"捐赠金额大于0");
        _;
    }

    modifier onlyOnwer(){
        require(owner==msg.sender, unicode"只有合约所有者可以提现");
        _;
    }

    modifier timeWindowClosed(){
        require(block.timestamp <= deployAt + lockDuration, unicode"捐赠期已过，无法捐赠");
        _;
    }

    function getDonation(address _address) public view returns(uint256){
        return donatorAmount[_address];
    }

    function getTopThreeDonators() public view returns (address[] memory){
        return topThreeDonators;
    }
}