// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./TokenA.sol";

contract Whitelist {

    bytes32 public merkleRoot;
    TokenA public token;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function checkInWhitelist(bytes32[] calldata proof, uint256 maxAllowanceToMint) view public returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, maxAllowanceToMint));
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);
        return verified;
    }

    mapping(address => bool) public minters;

    function claim (bytes32[] calldata proof, uint256 maxAllowanceToMint) public {
        require(checkInWhitelist(proof, maxAllowanceToMint), "You are not in the whitelist");
        require(minters[msg.sender] == false, "You have already claimed");
        minters[msg.sender] = true;
        token.mint(msg.sender, maxAllowanceToMint);
    }
    
}