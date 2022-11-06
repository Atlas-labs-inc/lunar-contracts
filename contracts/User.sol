//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct User {
    string username;
    string pfp_link;
    uint activity_karma;
    address main_wallet;
    address operator_wallet;
    bool is_moderator;
    string bio;
}

// Used on sign up
struct PartialUser {
    string username;
    address operator_wallet;
    string pfp_link;
    string bio;
}