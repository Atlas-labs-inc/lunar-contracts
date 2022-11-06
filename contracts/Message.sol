//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Message {
    uint id;
    uint timestamp;
    string username;
    string message;
    uint reply_id;
    string media;
}

struct PartialMessage {
    string username;
    string message;
    uint reply_id;
    string media;
}

enum Reactions {
    Fire,
    ThumbsUp,
    ThumbsDown,
    Heart,
    Siren
}