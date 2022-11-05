import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (deployer: Deployer, permission_contract, profile_contract) {
  const artifact = await deployer.loadArtifact("contracts/ChannelManager.sol:ChannelManager");
  const contract = await deployer.deploy(artifact, [permission_contract.address, profile_contract.address]);

  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  const chandle = await permission_contract.addSystemContract(contractAddress);
  await chandle.wait();

  // Set a new user and read using getter
  const addUserHandle = await contract.createChannel("eth-global");
  await addUserHandle.wait();
  const addUserHandle2 = await contract.createChannel("general");
  await addUserHandle2.wait();
  console.log("All channels:", await contract.getChannelNames());
    
  const messageHandle = await contract.newMessage('eth-global', {
    id: 0,
    timestamp: 0,
    username: "alpine",
    message: "Why does the fridge smell like shit",
    reply_id: 0,
    media: "",
  });
  await messageHandle.wait();
  const messageHandle1 = await contract.newMessage('eth-global', {
    username: "alpine",
    message: "sourdough is hella brown",
    reply_id: 0,
    media: "",
  });
  await messageHandle1.wait();
  console.log("Messages sent...");
  console.log("All messages:", await contract.getMessagesPaginated('eth-global', 0, 2));

  await(await contract.reactToMessage("eth-global", 0, 2)).wait(); 
  console.log("Reacted to message...");
  console.log(await contract.getReactionsForMessage('eth-global', 0))
  console.log("Total message count:", await contract.getNumberMessages('eth-global'));
  return contract
}