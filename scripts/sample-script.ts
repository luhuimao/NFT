// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const { web3 } = require("hardhat");
const hre = require("hardhat");
import { network, artifacts } from 'hardhat';

require("@nomiclabs/hardhat-web3");
const { ReplaceLine } = require('./boutils');
import { CyberBlock2077 } from '../typechain';
import { NFT_ADDRESS_RINKEBY, DEPLOY_ACCOUNT_MAINNET, NFT_ADDRESS_MAINNET } from '../.config';
// import { ethers, network, artifacts } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  let owner = new hre.ethers.Wallet('af43652256977c85d2e39d57258ed7a5a774c41ccc02c8c6fc8f709d316ddc55', hre.ethers.provider);
  var blockGaslimit0 = (await hre.ethers.provider.getBlock('latest')).gasLimit;
  var blockTimeStamp = (await hre.ethers.provider.getBlock('latest')).timestamp;
  console.log('blockTimeStamp: ', blockTimeStamp);
  var blockGaslimit = blockGaslimit0.div(4);
  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);
  let instanceCyberBlock2077: CyberBlock2077;

  const CyberBlock2077Factory = await hre.ethers.getContractFactory("CyberBlock2077");

  let deploygaslimit = await hre.ethers.provider.estimateGas(CyberBlock2077Factory.getDeployTransaction('Cyber_ID', 'Cyber_ID', 256, blockTimeStamp));

  console.log('deploy estimate gas:', deploygaslimit.toString());
  // console.log("######################## Deploy ########################");
  // instanceCyberBlock2077 = await CyberBlock2077Factory.connect(owner).deploy('Cyber_ID', 'Cyber_ID', 256, blockTimeStamp, { gasLimit: 4000000 });
  // await instanceCyberBlock2077.connect(owner).deployed();


  instanceCyberBlock2077 = CyberBlock2077Factory.connect(owner).attach(NFT_ADDRESS_MAINNET) as CyberBlock2077;
  console.log("CyberBlock2077Factory deployed to:", instanceCyberBlock2077.address);
  // console.log("######################## Setting NFT URI ########################");
  // await instanceCyberBlock2077.setBaseURI("ipfs://QmduMTifnayTKNbFLPVcHWXF921AoZ6TR5K6ZpUnayW1Ei/");
  // console.log("####################NFT baseURI: ", (await instanceCyberBlock2077.baseURI()).toString());

  console.log("########################call flipSaleState########################");
  //await instanceCyberBlock2077.flipSaleState();
  // let owner = new hre.ethers.Wallet(await getOwnerPrivateKey(network.name), ethers.provider);
  // let [, user] = await hre.ethers.getSigners();
  // console.log('balance: ', (await owner.getBalance()).toString());
  // console.log("########################mint 10 NFT########################");
  // let mingaslimit = await instanceCyberBlock2077.estimateGas.mintCyber(10);
  // console.log(mingaslimit.toString());
  // await instanceCyberBlock2077.connect(owner).mintCyber(10, {
  //   // from: user.address,
  //   value: hre.ethers.BigNumber.from("800000000000000000"),
  //   // gasLimit: blockGaslimit,
  // });

  // console.log('balance: ', web3.utils.fromWei((await user.getBalance()).toString(), 'ether'));


  // console.log("user NFT balance: ", (await instanceCyberBlock2077.balanceOf(owner.address)).toString());



  // console.log("######################## setRevealTimestamp ########################");
  // // await instanceCyberBlock2077.setRevealTimestamp((await hre.ethers.provider.getBlock("latest")).timestamp);
  // console.log("######################## Withdraw ########################");
   await instanceCyberBlock2077.withdraw();

  let flag = '\\/\\/REPLACE_FLAG';
  let key = 'NFT_ADDRESS_' + network.name.toUpperCase();
  ReplaceLine('.config.ts', key + '.*' + flag, key + ' = "' + instanceCyberBlock2077.address + '"; ' + flag);
  key = 'DEPLOY_ACCOUNT_' + network.name.toUpperCase();
  ReplaceLine('.config.ts', key + '.*' + flag, key + ' = "' + owner.address + '"; ' + flag);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
