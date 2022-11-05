//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import { User } from "./User.sol";
    
interface Profile {
    function getUser(string memory username) external view returns (User memory);
    function isAccountOperator(string memory username, address user_address) external view returns (bool);
    function userExists(string memory username) external view returns (bool);
    function incrementKarma(string memory username) external;
}