// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const { web3 } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");
const { ReplaceLine } = require('./boutils');
require('../typechain/BoredApeYachtClubs')
// import { ethers, network, artifacts } from 'hardhat';

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  let owner = new hre.ethers.Wallet('af43652256977c85d2e39d57258ed7a5a774c41ccc02c8c6fc8f709d316ddc55', ethers.provider);
  var blockGaslimit0 = (await hre.ethers.provider.getBlock('latest')).gasLimit;

  var blockGaslimit = blockGaslimit0.div(4);
  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // await greeter.deployed();

  // console.log("Greeter deployed to:", greeter.address);
  // let instanceBoredApeYachtClub: ConfigAddress;

  const BoredApeYachtClub = await hre.ethers.getContractFactory("BoredApeYachtClub");
  instanceBoredApeYachtClub = await BoredApeYachtClub.connect(owner).deploy('aaa', 'aaa', 20, 1423423432);


  // instanceConfigAddress = BoredApeYachtClub.connect(owner).attach(tmpaddr) as ConfigAddress;
  await instanceBoredApeYachtClub.connect(owner).deployed();
  console.log("BoredApeYachtClub deployed to:", instanceBoredApeYachtClub.address);


  console.log("########################call flipSaleState########################");
  await instanceBoredApeYachtClub.flipSaleState();
  // let owner = new hre.ethers.Wallet(await getOwnerPrivateKey(network.name), ethers.provider);
  [, user] = await hre.ethers.getSigners();
  console.log('balance: ', (await owner.getBalance()).toString());
  console.log("########################mint 2 NFT########################");
  await instanceBoredApeYachtClub.connect(owner).mintApe(2, {
    // from: user.address,
    value: hre.ethers.BigNumber.from("160000000000000000"),
    gasLimit: blockGaslimit,
  });

  // console.log('balance: ', web3.utils.fromWei((await user.getBalance()).toString(), 'ether'));


  console.log("user NFT balance: ", (await instanceBoredApeYachtClub.balanceOf(owner.address)).toString());
  console.log("######################## Setting NFT URI ########################");
  await instanceBoredApeYachtClub.setBaseURI("ipfs://QmPBhRqBeCbcpELAYfSyVooz4RCACNTD83s9ck7ZnQG4KW");
  console.log("####################NFT baseURI: ", (await instanceBoredApeYachtClub.baseURI()).toString());


  console.log("######################## setRevealTimestamp ########################");
  await instanceBoredApeYachtClub.setRevealTimestamp((await ethers.provider.getBlock("latest")).timestamp);

  let flag = '\\/\\/REPLACE_FLAG';
  let key = 'NFT_ADDRESS_' + network.name.toUpperCase();
  ReplaceLine('.config.ts', key + '.*' + flag, key + ' = "' + instanceBoredApeYachtClub.address + '"; ' + flag);
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
