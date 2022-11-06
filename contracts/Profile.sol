//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { User, PartialUser } from "./User.sol";
import { Permission } from "./PermissionInterface.sol";


contract Profile {
    // username => user
    mapping(string => User) users;

    // address => username
    mapping(address => string) user_by_main_address;

    // index => username
    mapping(uint => string) total_users;
    uint public current_user_count = 0;

    Permission public permission_manager;

    constructor (address _permission_manager) {
        permission_manager = Permission(_permission_manager);
    }

    /*
        __     __     ______     __     ______   ______    
       /\ \  _ \ \   /\  == \   /\ \   /\__  _\ /\  ___\   
       \ \ \/ ".\ \  \ \  __<   \ \ \  \/_/\ \/ \ \  __\   
        \ \__/".~\_\  \ \_\ \_\  \ \_\    \ \_\  \ \_____\ 
         \/_/   \/_/   \/_/ /_/   \/_/     \/_/   \/_____/ 
    */

    function newUser(PartialUser memory user) public {
        // Don't make an account if the username requested already exists
        require(!userExists(user.username));
        // An empty username is invalid
        // require(keccak256(bytes(user.username)) != keccak256(bytes("")));
        User memory _user = User(user.username, user.pfp_link, 0, msg.sender, user.operator_wallet, false, user.bio);
        users[user.username] = _user;
        total_users[current_user_count] = user.username;
        user_by_main_address[msg.sender] = user.username;
        current_user_count += 1;
    }

    function updateProfilePicture(string memory username, string memory new_pfp_link) public onlyAccountOperator(username, msg.sender) {
        users[username].pfp_link = new_pfp_link;
    }

    function updateBio(string memory username, string memory bio) public onlyAccountOperator(username, msg.sender) {
        users[username].bio = bio;
    }

    function updateOperatorAddress(string memory username, address new_operator) public onlyAccountOwner(username, msg.sender) {
        if(users[username].is_moderator) {
            permission_manager.updateModerator(users[username].operator_wallet, false);
            permission_manager.updateModerator(new_operator, true);
        }
        users[username].operator_wallet = new_operator;
    }

    function incrementKarma(string memory username) public {
        require(permission_manager.isSystemContract(msg.sender));
        users[username].activity_karma += 1;
    }

    function updateModeratorStatus(string memory username, bool update) public onlyOwner(msg.sender) {
        require(userExists(username));
        users[username].is_moderator = update;
        permission_manager.updateModerator(users[username].operator_wallet, update);
    }

    /*
         ______     ______     ______     _____    
         \  == \   /\  ___\   /\  __ \   /\  __-.  
        \ \  __<   \ \  __\   \ \  __ \  \ \ \/\ \ 
         \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \____- 
          \/_/ /_/   \/_____/   \/_/\/_/   \/____/ 
    */                                

    function userExists(string memory username) public view returns (bool) {
        return keccak256(bytes(users[username].username)) != keccak256(bytes(""));
    }

    function isAccountOwner(string memory username, address potential_user_address) public view returns (bool) {
        return userExists(username) && (users[username].main_wallet == potential_user_address);
    }

    function isAccountOperator(string memory username, address potential_user_address) public view returns (bool) {
        return userExists(username) && (users[username].operator_wallet == potential_user_address);
    }

    function getUser(string memory username) public view returns (User memory) {
        return users[username];
    }

    function getUserFromMainAddress(address main_address) public view returns (User memory) {
        return users[user_by_main_address[main_address]];
    }

    function getUsersPaginated(uint page, uint total) public view returns (User[] memory _users) {
        _users = new User[](total);
        uint offset = page*total;
        for (uint i = 0; i < total; i++) {
            _users[i] = users[total_users[offset+i]];
        }
    }

    function getAllUsers() public view returns (User[] memory _users) {
        _users = new User[](current_user_count);
        for (uint i = 0; i < current_user_count; i++) {
            _users[i] = users[total_users[i]];
        }
    }

    modifier onlyAccountOperator(string memory username, address potential_user_address) {
        require(isAccountOperator(username, potential_user_address));
        _;
    }

    modifier onlyAccountOwner(string memory username, address potential_user_address) {
        require(isAccountOwner(username, potential_user_address));
        _;
    }

    modifier onlyOwner(address username) {
        require(permission_manager.isOwner(msg.sender));
        _;
    }

}