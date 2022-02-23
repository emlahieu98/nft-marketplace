require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync("./.secret").toString();
const projectId = process.env.PROJECT_ID

module.exports = {
  networks: {
    hardhat: {
      chaiId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [PRIVATE_KEY]
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${projectId}`,
      accounts: [PRIVATE_KEY]
    },


  },
  solidity: "0.8.4",
};
