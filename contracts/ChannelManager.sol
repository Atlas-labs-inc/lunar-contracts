//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { PartialMessage, Message, Reactions } from "./Message.sol";
import { Permission } from "./PermissionInterface.sol";
import { Profile } from "./ProfileInterface.sol";

contract ChannelManager {

    event MessageEvent(string channel_name, Message message);
    event ReactionEvent(string channel_name, uint message_id, uint reaction_id);

    uint constant TOTAL_REACTIONS = 14;
    // mapping of channel name to message id to map of reaction enum values, and their counts
    mapping(string => mapping(uint => mapping(uint => uint))) message_reactions;
    // channel name => message id => Message
    mapping(string => mapping(uint => Message)) messages;
    // channel name => message_id
    mapping(string => uint) message_ids;
    // channel index => name
    mapping(uint => string) channels;
    uint public channel_id = 0;
    // channel name => bool
    mapping(string => bool) channel_exists;

    Permission public permission_manager;

    Profile public profile_manager;

    constructor (address _permission_manager, address _profile_manager) {
        permission_manager = Permission(_permission_manager);
        profile_manager = Profile(_profile_manager);
    }

    /*
        __     __     ______     __     ______   ______    
       /\ \  _ \ \   /\  == \   /\ \   /\__  _\ /\  ___\   
       \ \ \/ ".\ \  \ \  __<   \ \ \  \/_/\ \/ \ \  __\   
        \ \__/".~\_\  \ \_\ \_\  \ \_\    \ \_\  \ \_____\ 
         \/_/   \/_/   \/_/ /_/   \/_/     \/_/   \/_____/ 
    */

    function createChannel(string memory name) public onlyModerator(msg.sender) {
      // check if channel exists
      require(!channel_exists[name]);
      channels[channel_id] = name;
      channel_exists[name] = true;
      channel_id += 1;
    }

    function newMessage(string memory channel_name, PartialMessage memory _message) public onlyLiveChannels(channel_name) {
        require(profile_manager.isAccountOperator(_message.username, msg.sender));
        Message memory message = Message(
            message_ids[channel_name],
            block.timestamp,
            _message.username,
            _message.message,
            _message.reply_id,
            _message.media
        );
        messages[channel_name][message_ids[channel_name]] = message;
        message_ids[channel_name] += 1;
        profile_manager.incrementKarma(message.username);
        emit MessageEvent(channel_name, message);
    }

    function reactToMessage(string memory channel_name, uint message_id, uint reaction_id) public onlyLiveChannels(channel_name) {
        require (message_ids[channel_name] > message_id);
        require (reaction_id < TOTAL_REACTIONS);
        message_reactions[channel_name][message_id][reaction_id] += 1;
        emit ReactionEvent(channel_name, message_id, reaction_id);
    }

    /*
         ______     ______     ______     _____    
         \  == \   /\  ___\   /\  __ \   /\  __-.  
        \ \  __<   \ \  __\   \ \  __ \  \ \ \/\ \ 
         \ \_\ \_\  \ \_____\  \ \_\ \_\  \ \____- 
          \/_/ /_/   \/_____/   \/_/\/_/   \/____/ 
    */       

    function getMessage(string memory channel_name, uint message_id) public view onlyLiveChannels(channel_name) returns (Message memory) {
        require(message_ids[channel_name] > message_id);
        return messages[channel_name][message_id];
    }

    function getMessagesPaginated(string memory channel_name, uint page, uint total) public view onlyLiveChannels(channel_name) returns (Message[] memory all_messages) {
        require(channel_exists[channel_name]);
        uint offset = page*total;
        all_messages = new Message[](total);
        for (uint i = 0; i < total; i++) {
            all_messages[i] = messages[channel_name][offset + i];
        }
    }

    function getNumberMessages(string memory channel_name) public view onlyLiveChannels(channel_name) returns (uint) {
        return message_ids[channel_name];
    }

    function getChannelNames() public view returns (string[] memory channel_names) {
        channel_names = new string[](channel_id);
        for (uint i = 0; i < channel_id; i++) {
            channel_names[i] = channels[i];
        }
    }

    function getReactionsForMessage(string memory channel_name, uint message_id) public view onlyLiveChannels(channel_name) returns (uint[] memory) {
        require (message_ids[channel_name] > message_id);
        uint[] memory counts = new uint[](TOTAL_REACTIONS);
        for (uint i = 0; i < TOTAL_REACTIONS; i++) {
            counts[i] = message_reactions[channel_name][message_id][i];
        }
        return counts;
    }

    modifier onlyModerator(address potential_moderator) {
        require(permission_manager.isModerator(potential_moderator));
        _;
    }

    modifier onlyLiveChannels(string memory channel_name) {
        require(channel_exists[channel_name]);
        _;
    }

}