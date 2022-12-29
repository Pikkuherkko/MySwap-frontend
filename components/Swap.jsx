import { useState, useEffect } from "react";
import TokenField1 from "./TokenField1";
import TokenField2 from "./TokenField2";
import Settings from "./Settings";
import BeatLoader from "react-spinners/BeatLoader";
import { useMoralis } from "react-moralis";
import { ethers, BigNumber } from "ethers";
import {
  getRouterContract,
  getFactoryContract,
  getTokenContract,
} from "./ethFunctions";
import tokenlist from "./constants/tokenlist";
import Image from "next/image";
import gear from "../pictures/gear3.png";
import { useSpring, useTransition, animated } from "@react-spring/web";

const Swap = () => {
  const { account } = useMoralis();
  const [loading, setLoading] = useState(false);
  const [token1Amount, setToken1Amount] = useState(undefined);
  const [token2Amount, setToken2Amount] = useState(undefined);
  const [token1, setToken1] = useState(tokenlist[0]);
  const [token2, setToken2] = useState(tokenlist[1]);
  const [token1Contract, setToken1Contract] = useState(undefined);
  const [token2Contract, setToken2Contract] = useState(undefined);
  const [inputAmount, setInputAmount] = useState(undefined);
  const [outputAmount, setOutputAmount] = useState(undefined);
  const [slippageAmount, setSlippageAmount] = useState(1);
  const [deadlineMinutes, setDeadlineMinutes] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [ratio, setRatio] = useState(undefined);
  const [springs] = useSpring(() => ({
    from: { y: 100, x: -100, opacity: 0 },
    to: {
      y: 0,
      x: 0,
      opacity: 0.95,
    },
  }));
  const transition = useTransition(showSettings, {
    from: { x: -300, y: -400, opacity: 0 },
    enter: (item) => async (next) => {
      await next({ y: 0, x: 0, opacity: 0.2 });
      await next({ y: 0, x: 0, opacity: 1 });
    },
    leave: { x: -300, y: -400, opacity: 0 },
  });

  const ROUTERADDRESS = "0x35C0a8d14649768956821B9E5b8Eb19A6690DB55";
  // const FACTORYADDRESS = "0x0ba082cd80998Bdd49A4B47ce7C6F03489727b06";
  const WETH_ADDRESS = "0x140b09e9BF71AA0Cc0973e836E83F1A7a4EC7F75";

  const getSwapPrice = async (inputAmount) => {
    try {
      setLoading(true);
      setInputAmount(inputAmount);
      const routerContract = await getRouterContract();
      const tokens = [token1.address, token2.address];
      const amountIn = ethers.utils.parseUnits(inputAmount, "ether");
      const amountOut = await routerContract.callStatic.getAmountsOut(
        amountIn,
        tokens
      );
      console.log(amountOut[1].toString() / 1e18);
      setOutputAmount(ethers.utils.formatEther(amountOut[1]));
      const ratio = amountIn / amountOut[1];
      setRatio(ratio.toFixed(5));
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getBalances = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const token1Contract = await getTokenContract(token1.address);
      setToken1Contract(token1Contract);
      const token2Contract = await getTokenContract(token2.address);
      setToken2Contract(token2Contract);
      if (token1.symbol === "WETH") {
        provider.getBalance(account).then((res) => {
          setToken1Amount(Number(ethers.utils.formatEther(res)));
        });
      } else {
        token1Contract.balanceOf(account).then((res) => {
          setToken1Amount(Number(ethers.utils.formatEther(res)));
        });
      }
      if (token2.symbol === "WETH") {
        provider.getBalance(account).then((res) => {
          setToken2Amount(Number(ethers.utils.formatEther(res)));
        });
      } else {
        token2Contract.balanceOf(account).then((res) => {
          setToken2Amount(Number(ethers.utils.formatEther(res)));
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const swapETHForTokens = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = await getRouterContract();
      const path = [WETH_ADDRESS, token2.address];
      const amountIn = BigNumber.from(ethers.utils.parseUnits(inputAmount));
      const amountOut = await routerContract.callStatic.getAmountsOut(
        amountIn,
        path
      );
      await routerContract
        .connect(signer)
        .swapExactETHForTokens(
          amountOut[1],
          path,
          account,
          Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
          { gasLimit: ethers.utils.hexlify(1000000), value: amountIn }
        );
    } catch (err) {
      console.log(err);
    }
  };

  const swapTokensForETH = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = await getRouterContract();
      const path = [token1.address, WETH_ADDRESS];
      const amountIn = BigNumber.from(ethers.utils.parseUnits(inputAmount));
      const amountOut = await routerContract.callStatic.getAmountsOut(
        amountIn,
        path
      );
      const approvalAmount = ethers.utils.parseUnits("10000", 18).toString();
      const allowance = await token1Contract.allowance(account, ROUTERADDRESS);
      if (allowance < inputAmount * 10 ** 18) {
        let tx = await token1Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      if (allowance < inputAmount * 10 ** 18) {
        let tx = await token2Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      await routerContract
        .connect(signer)
        .swapExactTokensForETH(
          amountIn,
          amountOut[1],
          path,
          account,
          Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
          { gasLimit: ethers.utils.hexlify(1000000) }
        );
    } catch (err) {
      console.log(err);
    }
  };

  const swapTokensForTokens = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const routerContract = await getRouterContract();
      const path = [token1.address, token2.address];
      const amountIn = BigNumber.from(ethers.utils.parseUnits(inputAmount));
      const amountOut = await routerContract.callStatic.getAmountsOut(
        amountIn,
        path
      );
      const approvalAmount = ethers.utils.parseUnits("10000", 18).toString();
      const allowance = await token1Contract.allowance(account, ROUTERADDRESS);
      if (allowance < inputAmount * 10 ** 18) {
        let tx = await token1Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      if (allowance < inputAmount * 10 ** 18) {
        let tx = await token2Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      await routerContract
        .connect(signer)
        .swapExactTokensForTokens(
          amountIn,
          amountOut[1],
          path,
          account,
          Math.floor(Date.now() / 1000 + deadlineMinutes * 60),
          { gasLimit: ethers.utils.hexlify(1000000) }
        );
    } catch (err) {
      console.log(err);
    }
  };

  const swap = async () => {
    try {
      if (token1.symbol === "WETH") {
        await swapETHForTokens();
      } else if (token2.symbol === "WETH") {
        await swapTokensForETH();
      } else {
        await swapTokensForTokens();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateUIValues = async () => {
    try {
      await getBalances();
      await getFactoryContract();
      await getRouterContract();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      await updateUIValues();
    };
    loadPage();
  }, [token1, token2]);

  return (
    <div className="flex justify-center relative">
      <animated.div
        className="bg-red-600 p-4 rounded-2xl lg:right-72 w-96 relative"
        style={springs}
      >
        <div className="flex flex-row justify-between">
          <h2 className="font-bold text-xl text-white font-rubik">Swap</h2>
          <button className="" onClick={() => setShowSettings((v) => !v)}>
            <Image
              alt="gear"
              src={gear}
              width={20}
              height={20}
              className="hover:animate-spin"
            />
          </button>
          {transition((style, item) =>
            item ? (
              <animated.div style={style} className="fixed">
                <Settings
                  onClose={() => setShowSettings(false)}
                  setDeadlineMinutes={setDeadlineMinutes}
                  deadlineMinutes={deadlineMinutes}
                  setSlippageAmount={setSlippageAmount}
                  slippageAmount={slippageAmount}
                />
              </animated.div>
            ) : (
              ""
            )
          )}
        </div>
        <div className="flex-col flex justify-center">
          <TokenField1
            defaultValue={inputAmount || ""}
            setToken1={setToken1}
            getSwapPrice={getSwapPrice}
            balance={token1Amount}
          />
          <TokenField2
            setToken2={setToken2}
            value={outputAmount}
            balance={token2Amount}
            spinner={BeatLoader}
            loading={loading}
          />

          {ratio && (
            <div className="mt-2 text-white flex justify-end text-xs">
              Price: {ratio} {token1.name} per {token2.name}
            </div>
          )}

          <button
            className="bg-white mt-2 rounded-xl py-1 hover:bg-black hover:text-white font-kanit"
            onClick={() => swap()}
          >
            Swap
          </button>
        </div>
      </animated.div>
    </div>
  );
};

export default Swap;
