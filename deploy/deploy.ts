import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import SetupDeployer from "../deploy_helpers/load_ether";
import PermissionDeployer from "../deploy_helpers/permission_deployer";
import ProfileDeployer from "../deploy_helpers/profile_deployer";
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Lunar contracts...`);

  const deployer = await SetupDeployer(hre);
  console.log("Deployer setup...");

  const permission_contract = await PermissionDeployer(deployer);
  console.log("Permission contract initialized...");

  const profile_deployer = await ProfileDeployer(deployer, permission_contract);
  console.log("Profile contract initialized...");

}   