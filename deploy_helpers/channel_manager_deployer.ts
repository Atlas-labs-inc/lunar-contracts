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

  await(await contract.updateName("Lunar")).wait();
  await(await contract.updateIcon("https://i.imgur.com/0y0t0y0.png")).wait();
  await(await contract.updateBanner("https://i.imgur.com/ZYp2287.gif")).wait();
  console.log("Updated metadata...");

  // Set a new user and read using getter
  const addUserHandle = await contract.createChannel("lunar-chat");
  await addUserHandle.wait();
  const addUserHandle2 = await contract.createChannel("general");
  await addUserHandle2.wait();
  console.log("All channels:", await contract.getChannelNames());

  const interaction = await contract.newMessage('lunar-chat', {
    username: "alpine",
    message: "crab sandwich was scrumptious",
    reply_id: 0,
    media: "",
  });
  await interaction.wait();

  console.log("Messages sent...");
  console.log("All messages:", await contract.getMessagesPaginated('lunar-chat', 0, 1));

  await(await contract.reactToMessage("lunar-chat", 0, 2)).wait(); 
  console.log("Reacted to message...");
  console.log(await contract.getReactionsForMessage('lunar-chat', 0))
  console.log("Total message count:", await contract.getNumberMessages('lunar-chat'));
  return contract
}