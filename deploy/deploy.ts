import { HardhatRuntimeEnvironment } from "hardhat/types";
import SetupDeployer from "../deploy_helpers/load_ether";
import PermissionDeployer from "../deploy_helpers/permission_deployer";
import ProfileDeployer from "../deploy_helpers/profile_deployer";
import ChannelManagerDeployer from "../deploy_helpers/channel_manager_deployer";
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Lunar contracts...`);

  const deployer = await SetupDeployer(hre);
  console.log("Deployer setup...");

  const permission_contract = await PermissionDeployer(deployer);
  console.log("Permission contract initialized...");

  const profile_contract = await ProfileDeployer(deployer, permission_contract);
  console.log("Profile contract initialized...");
  
  const channel_manager_contract = await ChannelManagerDeployer(deployer, permission_contract, profile_contract);
  console.log("Channel Manager contract initialized...");
  await(await permission_contract.relinquish()).wait();
  console.log("Ellevated deployment permissions removed...");
}