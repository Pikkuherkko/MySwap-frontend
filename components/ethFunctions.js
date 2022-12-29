const { ethers, BigNumber } = require("ethers");
const ROUTERADDRESS = "0x35C0a8d14649768956821B9E5b8Eb19A6690DB55";
const FACTORYADDRESS = "0x0ba082cd80998Bdd49A4B47ce7C6F03489727b06";
const WETHADDRESS = "0x140b09e9BF71AA0Cc0973e836E83F1A7a4EC7F75";
const V2Factory = require("./constants/V2Factory.json");
const erc20abi = require("./constants/erc20abi.json");
const V2Router = require("./constants/V2Router.json");

export const getFactoryContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      FACTORYADDRESS,
      V2Factory.abi,
      provider
    );
    return factoryContract;
  } catch (err) {
    console.log(err);
  }
};

export const getTokenContract = async (token) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const tokenContract = new ethers.Contract(token, erc20abi, provider);
    return tokenContract;
  } catch (err) {
    console.log(err);
  }
};

export const getRouterContract = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const RouterContract = new ethers.Contract(
      ROUTERADDRESS,
      V2Router.abi,
      provider
    );
    return RouterContract;
  } catch (err) {
    console.log(err);
  }
};
