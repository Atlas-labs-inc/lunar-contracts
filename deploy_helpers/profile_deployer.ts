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
    pfp_link: "https://external-preview.redd.it/1Vncm1RCWTwILDiNiagAcPfH7sAnqD5g4JwahVjwKnA.jpg?auto=webp&s=b20f38b1f003360bf9cbfb1f6c249ac0b8f241ae",
    operator_wallet: deployer.zkWallet.address,
    bio: "soon to be father"
  });
  
  await handle.wait();
  const handle1 = await contract.newUser({
    username: 'samee',
    pfp_link: "https://cdn.dribbble.com/users/1176657/screenshots/15468294/media/34af996ddff444391edab94abcf3c7f3.png?compress=1&resize=400x300",
    operator_wallet: deployer.zkWallet.address,
    bio: "blue waterloo demon"
  });

  await handle1.wait();
  const handle2 = await contract.newUser({
    username: 'tristan',
    pfp_link: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThAZ5UCLIEjqABQutIKgffGUBw5uat4srjKI1cV8z7H9kfxR2brw_3-F5eMySuq-aFeOo&usqp=CAU",
    operator_wallet: deployer.zkWallet.address,
    bio: "Love react with my soul"
  });
  await handle2.wait();
  
  await(await contract.updateModeratorStatus('alpine', true)).wait();
  console.log("Set alpine as mod");

  console.log("Updated user object:", await contract.getUser('alpine'));

  return contract
}