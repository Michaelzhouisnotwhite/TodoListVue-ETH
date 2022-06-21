// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract TodoListUpgrade {
    mapping(address => string) public tasks;
    //    mapping(address => uint) public tasksCount;


    constructor() {
        put('[{"id": 1233124, "title": "get up early", "completed": true}]');
    }

    event putCompleted(string _content);

    function put(string memory _taskJsonString) public {
        tasks[msg.sender] = _taskJsonString;
        emit putCompleted(tasks[msg.sender]);
    }

    function get() public view returns(string memory) {
        return tasks[msg.sender];
    }
}
