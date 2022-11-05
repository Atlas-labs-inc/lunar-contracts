import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (deployer: Deployer, permission_contract) {
  const artifact = await deployer.loadArtifact("contracts/Profile.sol:Profile");
  const contract = await deployer.deploy(artifact, [permission_contract.address]);


  // Show the contract info.
  const contractAddress = contract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
  const chandle = await permission_contract.addSystemContract(contractAddress);
  await chandle.wait();
  console.log("Added system contract...");

  // Set a new user and read using getter
  const handle = await contract.newUser({
    username: 'alpine',
    pfp_link: 0,
    operator_wallet: deployer.zkWallet.address
  });
  await handle.wait();
  console.log("Deployed users username:", (await contract.getUser('alpine')).username);

  // Try to set a duplicate user
  try {
    const addSameUserHandle = await contract.newUser({
        username: 'alpine',
        pfp_link: 0,
        operator_wallet: deployer.zkWallet.address
    });
    await addSameUserHandle.wait();
    console.log("Created duplicate user");
  } catch (e) {
    console.log("Failed to create duplicate user...");
  }

  await(await contract.updateModeratorStatus('alpine', true)).wait();
  console.log("Set alpine as mod");

  console.log("Updated user object:", await contract.getUser('alpine'));

  return contract
}