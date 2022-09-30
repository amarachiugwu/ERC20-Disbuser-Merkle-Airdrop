import { ethers } from "hardhat";
const hre = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
// const {proofs} = data;
const proofs = require('./drop_ticket_roots.json');

async function main() {

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();

  await tokenA.deployed();

  console.log(`TokenA Address ${tokenA.address}`);


  const whitelistAddr1 = "0x328809bc894f92807417d2dad6b7c998c1afdac6";
    // const impersonatedSigner = await helpers.impersonateAccount(whitelistAddr1);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whitelistAddr1],
  });
  const signer = await ethers.getSigner(whitelistAddr1)

  console.log("signer: ", signer.address)


  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy("0xf2e8615a03ae7e449bb4915b0b30fe6977215194fba9d832c3aee1a61e757d88");

  await whitelist.deployed();

  const proof = proofs[whitelistAddr1].proof;
  // console.log("proof: ", proof)

  await helpers.setBalance(whitelistAddr1, ethers.utils.parseEther("2000000"));
  whitelist.connect(signer).claim(proof, 20)
  

  // console.log(`Whitelist Address ${whitelist.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
