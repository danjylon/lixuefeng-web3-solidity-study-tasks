// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.28;
/*
2✅ 反转字符串 (Reverse String)
题目描述：反转一个字符串。输入 "abcde"，输出 "edcba"
 
3✅  用 solidity 实现整数转罗马数字
题目描述在 https://leetcode.cn/problems/roman-to-integer/description/3.
4✅  用 solidity 实现罗马数字转数整数
题目描述在 https://leetcode.cn/problems/integer-to-roman/description/
5✅  合并两个有序数组 (Merge Sorted Array)
题目描述：将两个有序数组合并为一个有序数组。
6✅  二分查找 (Binary Search)
题目描述：在一个有序数组中查找目标值。
*/
contract TaskOne {

     // 2✅ 反转字符串 (Reverse String)
    function reverseString(string memory str) public pure returns(string memory) {
        bytes memory strBytes = bytes(str); 
        uint length = strBytes.length;
        for(uint i = 0; i < length / 2; i++) {
            // 用bytes1接收一个数组元素，use bytes1 to receive one element
            bytes1 temp = strBytes[i];
            strBytes[i] = strBytes[length - 1 - i];
            strBytes[length - 1 - i] = temp;
        }
        return string(strBytes);
    }

    // mapping(uint => string) public romanMap = {1:"I", 4:"IV", 5:"V", 9:"IX", 10:"X", 40:"XL", 50:"L", 90:"XC",100:"C", 400:"CD",500: "D", 900:"CM",1000:"M"};

    //3✅  用 solidity 实现整数转罗马数字, num <= 3999
    function intToRoman(uint num) public pure returns(string memory) {
        
        uint256[] memory values = new uint256[](13);
        string[] memory symbols = new string[](13);
        
        // 定义数值-符号映射表，按从大到小排序
        values[0] = 1000; symbols[0] = "M";
        values[1] = 900;  symbols[1] = "CM";
        values[2] = 500;  symbols[2] = "D";
        values[3] = 400;  symbols[3] = "CD";
        values[4] = 100;  symbols[4] = "C";
        values[5] = 90;   symbols[5] = "XC";
        values[6] = 50;   symbols[6] = "L";
        values[7] = 40;   symbols[7] = "XL";
        values[8] = 10;   symbols[8] = "X";
        values[9] = 9;    symbols[9] = "IX";
        values[10] = 5;    symbols[10] = "V";
        values[11] = 4;    symbols[11] = "IV";
        values[12] = 1;    symbols[12] = "I";
        
        string memory roman = "";
        
        // 贪心算法：从最大数值开始处理
        for(uint i = 0; i < values.length; i++) {
            while(num >= values[i]) {
                // abi.encodePacked(roman, symbols[i])实现字符串拼接，1994->MCMXCIV,
                roman = string(abi.encodePacked(roman, symbols[i]));
                // 将num减去刚才拼接的罗马字母对应的数
                num -= values[i];
            }
        }
        
        return roman;
    }
    // 4✅  用 solidity 实现罗马数字转数整数
    function romanToInteger(string memory romanStr) public pure returns(uint256) {
        bytes memory romanBytes = bytes(romanStr);
        uint256 total = 0;
        // 因为需要比较相邻两个字符，所以length只遍历到倒数第2个
        for (uint256 i = 0; i < romanBytes.length - 1; i++) {
            // 获取相邻两个字符
            uint256 current = charToValue(romanBytes[i]);
            uint256 next = charToValue(romanBytes[i + 1]);
            // 如果左边的比右边的小，那么就是一个4、9、40、90这种需要减掉的数，从总数中减去左边这个字符对应对应的数字
            if (current < next) {
                total -= current;
            } else {
                total += current;
            }
        }
        total += charToValue(romanBytes[romanBytes.length - 1]);
        return total;
    }

    function charToValue(bytes1 c) private pure returns (uint256) {
        if (c == 'I') return 1;
        if (c == 'V') return 5;
        if (c == 'X') return 10;
        if (c == 'L') return 50;
        if (c == 'C') return 100;
        if (c == 'D') return 500;
        if (c == 'M') return 1000;
        return 0;
    }

    // 5✅  合并两个有序数组 (Merge Sorted Array)，题目描述：将两个有序数组合并为一个有序数组。
    function mergeTwoArrays() public pure returns (uint256[] memory) {
        uint256[] memory array1 = new uint256[](10);
        uint256[] memory array2 = new uint256[](5);
        uint256[] memory array3 = new uint256[](array1.length+array2.length);
        
        // 定义数值-符号映射表，按从大到小排序
        array1[0] = 9; array1[1] = 10; array1[2] = 40; array1[3] = 50; array1[4] = 90; array1[5] = 100; array1[6] = 400; array1[7] = 500; array1[8] = 900; array1[9] = 1000;   
        array2[0] = 9; array2[1] = 10; array2[2] = 40; array2[3] = 50; array2[4] = 90; 
        uint256 length = array1.length;
        if(length>array2.length) length = array2.length;
        // memory数组不支持push
        uint256 array3Index = 0;
        for(uint256 i = 0;i<length; i++){
            array3[array3Index] = array1[i];array3Index++;
            array3[array3Index] = array2[i];array3Index++;
        }
        for(uint256 i = length;i<array1.length; i++){
            array3[array3Index]= array1[i];array3Index++;
        }
        for(uint256 i = length;i<array2.length; i++){
            array3[array3Index]= array2[i];array3Index++;
        }
        array3 = bubbleSort(array3);
        return array3;
    }

    // 冒泡排序
    function bubbleSort(uint256[] memory arr) internal pure returns (uint256[] memory) {
        uint256 n = arr.length;
        for (uint256 i = 0; i < n - 1; i++) {
            for (uint256 j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // 交换元素
                    uint256 temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    // 6✅  二分查找 (Binary Search)，题目描述：在一个有序数组中查找目标值。
    function binarySearch(uint256 x) public pure returns (uint256) {
        uint256[] memory arr = new uint256[](10);
        arr[0] = 9; arr[1] = 10; arr[2] = 40; arr[3] = 50; arr[4] = 90; arr[5] = 100; arr[6] = 400; arr[7] = 500; arr[8] = 900; arr[9] = 1000; 
        uint256 left = 0;
        uint256 right = arr.length;
        uint256 index = (left+right)/2;
        uint256 mid = arr[index];
        while(mid!=x){
            if(x<mid){
                right = index;
            }else {
                left = index;
            }
            index = (left+right)/2;
            mid = arr[index];
            if(index == arr.length-1 && x>mid){
                revert("index not found");
                // break;
            }
        }
        return index;
    }
}