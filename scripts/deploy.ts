import { ethers } from "hardhat";
const hardHat = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const proofs = require('../gen_files/drop_ticket_roots.json');

async function main() {

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log(`TokenA Address ${tokenA.address}`);


  const whitelistAddr1 = "0x328809bc894f92807417d2dad6b7c998c1afdac6";

  // await helpers.impersonateAccount();
  // const impersonatedSigner = await ethers.getSigner();

  await hardHat.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [whitelistAddr1],
  });
  const signer = await ethers.getSigner(whitelistAddr1)

  console.log("signer: ", signer.address)


  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy("0x7acbd35877b1fb1bb1b44ce1190be0dcd824e6e2ef255f89ba1251ebecad0b9d", tokenA.address);
  await whitelist.deployed();
  console.log(`Whitelist Address ${whitelist.address}`);
  const interact = await ethers.getContractAt("Whitelist", whitelist.address);


  console.log("SENDING TOKEN TO AIRDROP CONTRACT");
  await tokenA.transfer(whitelist.address, ethers.utils.parseEther("2000"));

  const proof = proofs[whitelistAddr1].proof;
  console.log("proof: ", proof);

  await helpers.setBalance(whitelistAddr1, ethers.utils.parseEther("2000000"));
  const claim = await interact.connect(signer).claim(proof, 20);
  const result = await claim.wait();

  const bal = await tokenA.balanceOf(signer.address);

  console.log(`CLAIMING : ${result}`);
  console.log(`CLAIMING : ${bal}`);

  // const claim2 = await interact.connect(signer).claim(proof, 20); // should fail
  // console.log(`CLAIMING : ${bal}`);  
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
