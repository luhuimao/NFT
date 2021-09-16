require("@nomiclabs/hardhat-waffle");
require('@typechain/hardhat')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
// require('hardhat-typechain');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/3ba2cd9897d34c71ba203bd51488caa1',
      //accounts: [privateKey1, privateKey2, ...]
    },
    mainnet:{
      url:'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './build/cache',
    artifacts: './build/artifacts',
  },
  solidity: {
    compilers: [
      {
        version: "0.5.5"
      },
      {
        version: "0.6.7",
        settings: {}
      },
      {
        version: "0.7.4",
      }
    ]
  }
};
