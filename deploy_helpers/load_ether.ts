import { utils, Wallet } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const wallet = new Wallet(hre.config.zkSyncDeploy.account);

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Don't throw ether away
  const hasMinBalance = await (await deployer.zkWallet.getBalance()).gt(ethers.utils.parseEther("0.01"));
  if(!hasMinBalance){
    // Deposit some funds to L2 in order to be able to perform L2 transactions.
    const depositAmount = ethers.utils.parseEther("0.01");
    const depositHandle = await deployer.zkWallet.deposit({
        to: deployer.zkWallet.address,
        token: utils.ETH_ADDRESS,
        amount: depositAmount,
    });
    // Wait until the deposit is processed on zkSync
    await depositHandle.wait();
  }
  return deployer;
}