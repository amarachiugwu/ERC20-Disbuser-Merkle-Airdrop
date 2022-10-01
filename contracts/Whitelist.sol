// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./TokenA.sol";

contract Whitelist {

    bytes32 public merkleRoot;
    address public token;

    constructor(bytes32 _merkleRoot, address tokenAddr) {
        merkleRoot = _merkleRoot;
        token = tokenAddr;
    }

    function checkInWhitelist(bytes32[] calldata proof, uint256 maxAllowanceToMint) view public returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, maxAllowanceToMint));
        // bytes32 leaf = 0xd2fb9bc4453a931ecf93a02b841e94a7c5b2ab543f09a331e4ed7a383518d933;
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);
        return verified;
    }

    mapping(address => bool) public minters;

    function claim (bytes32[] calldata proof, uint256 maxAllowanceToMint) public {
        require(checkInWhitelist(proof, maxAllowanceToMint), "You are not in the whitelist");
        require(minters[msg.sender] == false, "You have already claimed");
        minters[msg.sender] = true;
        TokenA(token).transfer(payable(msg.sender), maxAllowanceToMint);
    }
    
}