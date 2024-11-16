require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    ropsten: {
        url: `https://mainnet.infura.io/v3/2103903941514fd88a1652d95140f42e`,
        accounts: [`0x40547e62ca7adcb69d41a8b2ae28bbf558690c17f9b53260f7de36089f5964ca`]
    }
}
};
