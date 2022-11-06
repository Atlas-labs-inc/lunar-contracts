//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Permission {
    function isOwner(address potential_owner) external view returns (bool);
    function isModerator(address potential_moderator) external view returns (bool);
    function isSystemContract(address potential_system_contract) external view returns (bool);
    function isDeployer(address potential_deployer) external view returns (bool);
    function updateModerator(address moderator, bool state) external;
    function setOwner(address new_owner) external;
}