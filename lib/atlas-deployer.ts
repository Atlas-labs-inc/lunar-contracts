import { Deployer, Overrides } from "@matterlabs/hardhat-zksync-deploy";
import { ZkSyncArtifact } from "@matterlabs/hardhat-zksync-deploy/dist/types";
import * as ethers from 'ethers';
import * as zk from 'zksync-web3';
import netrc from 'node-netrc';
import axios from "axios";

export class AtlasDeployer extends Deployer {
  constructor(hre, wallet, upload_contracts: boolean = true) {
    super(hre, wallet);
    // @ts-ignore
    this.upload_contracts = upload_contracts;
  }

  private async sendContractToAtlas(contractAddress: string, contractName: string) {
    try {
        const response = await axios.post('https://api.atlaszk.com/blockchain/contract', {
                rpc_url: this.hre.config.zkSyncDeploy.zkSyncNetwork,
                contract_name: contractName,
                contract_address: contractAddress
            },
            {
                headers: {
                    'Authorization': `Bearer ${netrc('atlaszk.com').password}`
                }
            }
        );
        if(response.status != 200 || response.data.status != 'success') {
            throw new Error(`Contract upload failed`);
        }
    } catch (e) {
        console.log("Log in with `atlas login` to upload your contracts to Atlas");
    }
  }
  /**
     * Sends a deploy transaction to the zkSync network.
     * For now, it will use defaults for the transaction parameters:
     * - fee amount is requested automatically from the zkSync server.
     *
     * @param artifact The previously loaded artifact object.
     * @param constructorArguments List of arguments to be passed to the contract constructor.
     * @param overrides Optional object with additional deploy transaction parameters.
     * @param additionalFactoryDeps Additional contract bytecodes to be added to the factory dependencies list.
     *
     * @returns A contract object.
     */
  public async deploy(
    artifact: ZkSyncArtifact,
    constructorArguments: any[] = [],
    overrides?: Overrides,
    additionalFactoryDeps?: ethers.BytesLike[],
): Promise<zk.Contract> {
    const contract = await super.deploy(artifact, constructorArguments, overrides, additionalFactoryDeps);
    // @ts-ignore
    if(this.upload_contracts) {
        await this.sendContractToAtlas(contract.address, artifact.contractName);
    }
    return contract;
  }

}