//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract DeCalend {
    uint rate;
    address public owner;

    struct Appointment {
        string title;
        address attendee;
        uint startTime;
        uint endTime;
        uint amountPaid;
    }

    Appointment[] appointments;

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

    function getAppointments() public view returns(Appointment[] memory) {
        return appointments;
    }

    function createAppointment(string memory _title, uint _startTime, uint _endTime) payable public {
        uint _amountPaid = ((_endTime - _startTime)/60)*rate;
        address _attendee = msg.sender;

        require(msg.value >= _amountPaid, "Please send more ethers");

        (bool success, ) = owner.call{value : msg.value}("");

        require(success, "Failed to send ethers");

        appointments.push(Appointment(_title, _attendee, _startTime, _endTime, _amountPaid));
    }   
}
