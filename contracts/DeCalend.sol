//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract DeCalend {
    uint rate;
    address owner;

    constructor () {
        owner = msg.sender;
    }

    function getRate() public view  returns(uint) {
        return rate;
    }

    function setRate(uint _rate) public {
        require(owner == msg.sender, "Only the owner can set the rate!");
        rate = _rate;
    }

}
