import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import tokenlist from "./constants/tokenlist";
import V2Router from "./constants/V2Router.json";
import V2Factory from "./constants/V2Factory.json";
import erc20abi from "./constants/erc20abi.json";

import { useSpring, animated } from "@react-spring/web";

const TopTokens = () => {
  const [prices, setPrices] = useState([]);
  const [TVL, setTVL] = useState([]);
  const [springs, api] = useSpring(() => ({
    from: { y: 100, opacity: 0, friction: 120 },
    to: {
      y: 0,
      opacity: 0.95,
    },
  }));

  const ROUTERADDRESS = "0x35C0a8d14649768956821B9E5b8Eb19A6690DB55";
  const WETH_ADDRESS = "0x140b09e9BF71AA0Cc0973e836E83F1A7a4EC7F75";
  const FACTORYADDRESS = "0x0ba082cd80998Bdd49A4B47ce7C6F03489727b06";

  const getTokens = async () => {
    for (let i = 0; i < tokenlist.length; i++) {
      const price = await getPrices(tokenlist[i].address);
      const priceShort = Number(price).toFixed(4);
      setPrices((prev) => [...prev, priceShort]);
    }
    for (let i = 0; i < tokenlist.length; i++) {
      const tvl = await getReserves(tokenlist[i].address);
      const tvlShort = Number(tvl).toFixed(4);
      setTVL((prev) => [...prev, tvlShort]);
    }
  };

  const getPrices = async (tokenAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const routerContract = new ethers.Contract(
        ROUTERADDRESS,
        V2Router.abi,
        provider
      );
      const tokens = [tokenAddress, WETH_ADDRESS];
      const amountIn = ethers.utils.parseUnits("1", "ether");
      if (tokenAddress == WETH_ADDRESS) {
        return 1;
      } else {
        const amountOut = await routerContract.callStatic.getAmountsOut(
          amountIn,
          tokens
        );
        return ethers.utils.formatEther(amountOut[1]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getReserves = async (tokenAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20abi,
        provider
      );
      const factoryContract = new ethers.Contract(
        FACTORYADDRESS,
        V2Factory.abi,
        provider
      );
      let tvl = 0;
      for (let i = 0; i < tokenlist.length; i++) {
        const poolAddress = await factoryContract.getPair(
          tokenAddress,
          tokenlist[i].address
        );
        const balance = await tokenContract.balanceOf(poolAddress);
        tvl = tvl + Number(balance);
      }
      return tvl / 1e18;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadPage = () => {
      getTokens();
    };
    loadPage();
  }, []);

  return (
    <animated.div
      className="flex flex-col items-center mt-0 font-kanit"
      style={springs}
    >
      <h1 className="text-white text-3xl font-bold mb-4 bg-cyan-900 rounded-full p-3 bg-opacity-70">
        Token analytics
      </h1>
      <div className="flex flex-col justify-between bg-cyan-900 p-4 px-12 rounded-xl md:w-1/2 w-fit">
        <div className="flex flex-row text-center text-white font-bold mb-2">
          <div className="basis-1/4">Token name</div>
          <div className="basis-1/4">Price</div>
          <div className="basis-1/4">TVL</div>
          <div className="basis-1/4">TVL ETH</div>
        </div>
        <hr />
        <div className="mt-4">
          {tokenlist.map((a, idx) => (
            <div
              key={idx}
              className={`flex flex-row text-white text-center ${
                idx !== tokenlist.length - 1 ? "mb-8" : "mb-0"
              }`}
            >
              <div className="basis-1/4 text-lg font-semibold font-rubik">
                {a.name}
              </div>
              <div className="basis-1/4">{prices[idx]} ETH</div>
              <div className="basis-1/4">{TVL[idx]}</div>
              <div className="basis-1/4">
                {(prices[idx] * TVL[idx]).toFixed(2)} ETH
              </div>
            </div>
          ))}
        </div>
      </div>
    </animated.div>
  );
};

export default TopTokens;
