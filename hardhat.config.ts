require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");
require('dotenv').config({path:__dirname+'/.env'});

module.exports = {
  zksolc: {
    version: "1.1.0",
    compilerSource: "docker",
    settings: {
      optimizer: {
        enabled: true,
      },
      experimental: {
        dockerImage: "matterlabs/zksolc",
        tag: "v1.1.0"
      }
    },
  },
  zkSyncDeploy: {
    zkSyncNetwork: "http://ec2-18-210-15-152.compute-1.amazonaws.com:3050",
    ethNetwork: "https://sepolia.infura.io/v3/a0648f7545334ce49d4e66fd6dfed41b", // Can also be the RPC URL of the network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
    account: process.env.KEY
  },
  networks: {
    hardhat: {
      zksync: true,
    },
  },
  solidity: {
    version: "0.8.16",
  },
};