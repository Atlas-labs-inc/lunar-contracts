import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (deployer: Deployer) {
  const artifact = await deployer.loadArtifact("contracts/Permission.sol:Permission");
  const contract = await deployer.deploy(artifact);
  await contract.deployed();
  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  const handler = await contract.addSystemContract(contract.address);
  await handler.wait();

  // Set a new user and read using getter
  const addUserHandle = await contract.setOwner(deployer.zkWallet.address);
  await addUserHandle.wait();
  console.log("Owner:", (await contract.owner()));
  console.log("Deployer:", (await contract.deployer()));
  return contract
}