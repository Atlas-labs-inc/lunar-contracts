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

  await(await contract.updateName("Lunar test")).wait();
  await(await contract.updateIcon("https://i.imgur.com/0y0t0y0.png")).wait();
  await(await contract.updateBanner("https://i.imgur.com/ZYp2287.gif")).wait();
  console.log("Updated metadata...");

  // Set a new user and read using getter
  const addUserHandle = await contract.createChannel("eth-global");
  await addUserHandle.wait();
  const addUserHandle2 = await contract.createChannel("general");
  await addUserHandle2.wait();
  console.log("All channels:", await contract.getChannelNames());

  const interaction = await contract.newMessage('eth-global', {
    username: "alpine",
    message: "crab sandwich ong",
    reply_id: 0,
    media: "",
  });
  await interaction.wait();

  await (await contract.newMessage('eth-global', {
    username: "samee",
    message: "this choppa came with a compressor",
    reply_id: 0,
    media: "",
  })).wait();
  await (await contract.newMessage('eth-global', {
    username: "tristan",
    message: "if i was will smith i would've smacked em with the stick",
    reply_id: 0,
    media: "",
  })).wait();
  await (await contract.newMessage('eth-global', {
    username: "alpine",
    message: "alright true",
    reply_id: 0,
    media: "",
  })).wait();
  await (await contract.newMessage('eth-global', {
    username: "samee",
    message: "shot his ass twenty times",
    reply_id: 0,
    media: "",
  })).wait();
  await (await contract.newMessage('eth-global', {
    username: "tristan",
    message: "bro's cheesing fr",
    reply_id: 0,
    media: "",
  })).wait();

  console.log("Messages sent...");
  console.log("All messages:", await contract.getMessagesPaginated('eth-global', 0, 10));

  await(await contract.reactToMessage("eth-global", 0, 2)).wait(); 
  console.log("Reacted to message...");
  console.log(await contract.getReactionsForMessage('eth-global', 0))
  console.log("Total message count:", await contract.getNumberMessages('eth-global'));
  return contract
}