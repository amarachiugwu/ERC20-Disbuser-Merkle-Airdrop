// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

    contract TokenA is ERC20( "TokenA", "TKA" ) {
        constructor() {
            // _mint(msg.sender, 1000000e18);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
      
}
