//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { User } from "./User.sol";

contract Permission {
    mapping(address => bool) public moderators;

    mapping(address => bool) public system_contracts;
    address public owner;
    address public deployer;
    
    constructor () {
        deployer = msg.sender;
    }

    /*
        __     __     ______     __     ______   ______    
       /\ \  _ \ \   /\  == \   /\ \   /\__  _\ /\  ___\   
       \ \ \/ ".\ \  \ \  __<   \ \ \  \/_/\ \/ \ \  __\   
        \ \__/".~\_\  \ \_\ \_\  \ \_\    \ \_\  \ \_____\ 
         \/_/   \/_/   \/_/ /_/   \/_/     \/_/   \/_____/ 
    */

    function addSystemContract(address system_contract) public onlyDeployer {
        system_contracts[system_contract] = true;
    }

    function setOwner(address new_owner) public {
        require(isSystemContract(msg.sender) || isDeployer(msg.sender));
        owner = new_owner;
    }
 
    function updateModerator(address moderator, bool state) public {
        require(isSystemContract(msg.sender));
        moderators[moderator] = state;
    }

    function relinquish() public onlyDeployer {
        deployer = address(0);
    }

    /*
         ______     ______     ______     _____    
         \  == \   /\  ___\   /\  __ \   /\  __-.  
        \ \  __<   \ \  __\   \ \  __ \  \ \ \/\ \ 
         \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \____- 
          \/_/ /_/   \/_____/   \/_/\/_/   \/____/ 
    */   

    function isOwner(address potential_owner) public view returns (bool) {
        return potential_owner == owner;
    }

    function isModerator(address potential_moderator) public view returns (bool) {
        return moderators[potential_moderator];
    }

    function isSystemContract(address potential_system_contract) public view returns (bool) {
        return system_contracts[potential_system_contract];
    }

    function isDeployer(address potential_deployer) public view returns (bool) {
        return deployer == potential_deployer;
    }

    modifier onlyOwner() {
        require(isOwner(msg.sender));
        _;
    }

    modifier onlyModerator() {
        require(isModerator(msg.sender));
        _;
    }

    modifier onlyDeployer() {
        require(isDeployer(msg.sender));
        _;
    }

}