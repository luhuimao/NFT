const hre = require("hardhat");
import { network, artifacts } from 'hardhat';

require("@nomiclabs/hardhat-web3");
const { ReplaceLine } = require('./boutils');
import { CyberBlock2077 } from '../typechain';

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');
    let owner = new hre.ethers.Wallet('af43652256977c85d2e39d57258ed7a5a774c41ccc02c8c6fc8f709d316ddc55', hre.ethers.provider);
    // let [owner, user] = await hre.ethers.getSigners();
    console.log('owner balance: ', hre.ethers.utils.formatEther(await owner.getBalance()), ' ETH');
    // console.log('user balance: ', hre.ethers.utils.formatEther(await user.getBalance()), ' ETH');

    var blockGaslimit0 = (await hre.ethers.provider.getBlock('latest')).gasLimit;
    var blockTimeStamp = (await hre.ethers.provider.getBlock('latest')).timestamp;
    console.log('blockTimeStamp: ', blockTimeStamp);
    var blockGaslimit = blockGaslimit0.div(4);

    let instanceCyberBlock2077: CyberBlock2077;

    const CyberBlock2077Factory = await hre.ethers.getContractFactory("CyberBlock2077");

    let deploygaslimit = await hre.ethers.provider.estimateGas(CyberBlock2077Factory.getDeployTransaction('Cyber_ID', 'Cyber_ID', 256, blockTimeStamp));

    console.log('deploy estimate gas:', deploygaslimit.toString());
    console.log("######################## Deploy ########################");
    instanceCyberBlock2077 = await CyberBlock2077Factory.connect(owner).deploy('Cyber_ID', 'Cyber_ID', 256, blockTimeStamp, { gasLimit: 4000000 });
    await instanceCyberBlock2077.connect(owner).deployed();

    let flag = '\\/\\/REPLACE_FLAG';
    let key = 'NFT_ADDRESS_' + network.name.toUpperCase();
    ReplaceLine('.config.ts', key + '.*' + flag, key + ' = "' + instanceCyberBlock2077.address + '"; ' + flag);
    key = 'DEPLOY_ACCOUNT_' + network.name.toUpperCase();
    ReplaceLine('.config.ts', key + '.*' + flag, key + ' = "' + owner.address + '"; ' + flag);

    // instanceCyberBlock2077 = CyberBlock2077Factory.connect(owner).attach(NFT_ADDRESS_MAINNET) as CyberBlock2077;
    // console.log("CyberBlock2077Factory deployed to:", instanceCyberBlock2077.address);

    console.log("######################## Setting NFT URI ########################");
    await instanceCyberBlock2077.connect(owner).setBaseURI("ipfs://QmduMTifnayTKNbFLPVcHWXF921AoZ6TR5K6ZpUnayW1Ei/");
    console.log("####################NFT baseURI: ", (await instanceCyberBlock2077.baseURI()).toString());

    console.log("########################call flipSaleState########################");
    await instanceCyberBlock2077.connect(owner).flipSaleState();
    // let owner = new hre.ethers.Wallet(await getOwnerPrivateKey(network.name), ethers.provider);
    // let [, user] = await hre.ethers.getSigners();
    // console.log('balance: ', (await owner.getBalance()).toString());

    console.log('owner balance: ', hre.ethers.utils.formatEther(await owner.getBalance()), ' ETH');

    console.log("########################mint 10 NFT########################");
    // let mingaslimit = await instanceCyberBlock2077.estimateGas.mintCyber(10);
    // console.log(mingaslimit.toString());
    await instanceCyberBlock2077.connect(owner).connect(owner).mintCyber(10, {
        // from: user.address,
        value: hre.ethers.utils.parseEther('0.8'),
        gasLimit: 4000000,
    });

    // console.log('balance: ', web3.utils.fromWei((await user.getBalance()).toString(), 'ether'));


    console.log("user NFT balance: ", (await instanceCyberBlock2077.balanceOf(owner.address)).toString());



    // console.log("######################## setRevealTimestamp ########################");
    // // await instanceCyberBlock2077.setRevealTimestamp((await hre.ethers.provider.getBlock("latest")).timestamp);
    // console.log("######################## Withdraw ########################");
    //  await instanceCyberBlock2077.withdraw();


}

async function getTokenIDByIndex() {
    let owner = new hre.ethers.Wallet('af43652256977c85d2e39d57258ed7a5a774c41ccc02c8c6fc8f709d316ddc55', hre.ethers.provider);

    const CyberBlock2077Factory = await hre.ethers.getContractFactory("CyberBlock2077");

    let instanceCyberBlock2077 = CyberBlock2077Factory.connect(owner).attach('0x18f6cee485d746E4232416776d82F232358Ba371') as CyberBlock2077;

    let NFTbalance = await instanceCyberBlock2077.balanceOf(owner.address);
    console.log("user NFT balance: ", NFTbalance.toString());

    for (let i = 0; i < parseInt(NFTbalance.toString()); i++) {
        let tokenid = await instanceCyberBlock2077.tokenOfOwnerByIndex(owner.address, i);
        console.log('token id: ', tokenid.toString(), ' of index: ', i);
    }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
getTokenIDByIndex()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
