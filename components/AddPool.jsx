import { ethers, BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import pairABI from "./constants/V2Pair.json";
import tokenlist from "./constants/tokenlist";
import {
  getFactoryContract,
  getTokenContract,
  getRouterContract,
} from "./ethFunctions";
import { useMoralis } from "react-moralis";

import { useSpring, animated } from "@react-spring/web";

const AddPool = () => {
  const { account } = useMoralis();
  const [provider, setProvider] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [token1, setToken1] = useState(tokenlist[0]);
  const [token2, setToken2] = useState(tokenlist[1]);
  const [inputAmount, setInputAmount] = useState("0");
  const [deadline, setDeadline] = useState(10);
  const [token1Liq, setToken1Liq] = useState(undefined);
  const [token2Liq, setToken2Liq] = useState(undefined);
  const [tokenBRequired, setTokenBRequired] = useState(undefined);
  const [removeAmount, setRemoveAmount] = useState(undefined);
  const [LPAmount, setLPAmount] = useState(undefined);
  const [springs] = useSpring(() => ({
    from: { y: 100, opacity: 0 },
    to: {
      y: 0,
      opacity: 0.9,
    },
  }));

  const ROUTERADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  // const FACTORYADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const WETHADDRESS = "0x140b09e9BF71AA0Cc0973e836E83F1A7a4EC7F75";

  const getPoolAddress = async () => {
    try {
      const factoryContract = await getFactoryContract();
      const poolAddress = await factoryContract.getPair(
        token1.address,
        token2.address
      );
      return poolAddress;
    } catch (err) {
      console.log(err);
    }
  };

  const getPoolContract = async () => {
    try {
      const poolAddress = await getPoolAddress();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      const pool = new ethers.Contract(poolAddress, pairABI.abi, provider);
      return pool;
    } catch (err) {
      console.log(err);
    }
  };

  const addLiquidityTokens = async () => {
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const Router = await getRouterContract();
      const token1Amount = BigNumber.from(ethers.utils.parseUnits(inputAmount));
      const token2Amount = BigNumber.from(
        ethers.utils.parseUnits(tokenBRequired)
      );
      // NOTE: replace the hex value init in UniswapV2Library with hashed bytecode of compiled UniswapV2Pair.sol
      let tx = await Router.connect(signer)
        .addLiquidity(
          token1.address,
          token2.address,
          token1Amount,
          token2Amount,
          "0",
          "0",
          account,
          deadline,
          {
            // gasLimit: ethers.utils.hexlify(30000000),
            // gasPrice: BigNumber.from(50000000000),
          }
        )
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
      console.log("tx", tx);
    } catch (err) {
      console.log(err);
    }
  };

  const addLiquidityETH = async () => {
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const Router = await getRouterContract();
      const token1Amount = BigNumber.from(ethers.utils.parseUnits(inputAmount));
      const token2Amount = BigNumber.from(
        ethers.utils.parseUnits(tokenBRequired)
      );
      if (token1.address == WETHADDRESS) {
        let tx = await Router.connect(signer)
          .addLiquidityETH(
            token2.address,
            token2Amount,
            "0",
            "0",
            account,
            deadline,
            {
              value: token1Amount,
              // gasLimit: ethers.utils.hexlify(30000000),
              // gasPrice: BigNumber.from(50000000000),
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else {
        let tx = await Router.connect(signer)
          .addLiquidityETH(
            token1.address,
            token1Amount,
            "0",
            "0",
            account,
            deadline,
            {
              value: token2Amount,
              // gasLimit: ethers.utils.hexlify(30000000),
              // gasPrice: BigNumber.from(50000000000),
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addLiquidity = async () => {
    try {
      const signer = provider.getSigner();
      const approvalAmount = ethers.utils.parseUnits("10000", 18).toString();
      const token1Contract = await getTokenContract(token1.address);
      const token2Contract = await getTokenContract(token2.address);
      const allowance1 = await token1Contract.allowance(account, ROUTERADDRESS);
      if (allowance1 < inputAmount * 10 ** 18) {
        let tx = await token1Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      const allowance2 = await token2Contract.allowance(account, ROUTERADDRESS);
      if (allowance2 < tokenBRequired * 10 ** 18) {
        let tx = await token2Contract
          .connect(signer)
          .approve(ROUTERADDRESS, approvalAmount);
        await tx.wait();
      }
      if (token1.address == WETHADDRESS || token2.address == WETHADDRESS) {
        await addLiquidityETH();
      } else {
        await addLiquidityTokens();
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const removeLiquidity = async () => {
    try {
      const value = BigNumber.from(ethers.utils.parseUnits(removeAmount));
      const signer = provider.getSigner();
      const Router = await getRouterContract();
      const pool = await getPoolContract();
      await pool.connect(signer).approve(ROUTERADDRESS, value);
      // eth + token
      if (token1.address === WETHADDRESS) {
        await Router.connect(signer)
          .removeLiquidityETH(
            token2.address,
            value,
            "0",
            "0",
            account,
            deadline,
            {
              gasLimit: ethers.utils.hexlify(30000000),
              // gasPrice: BigNumber.from(50000000000),
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
        // token + eth
      } else if (token2.address === WETHADDRESS) {
        await Router.connect(signer)
          .removeLiquidityETH(
            token1.address,
            value,
            "0",
            "0",
            account,
            deadline,
            {
              gasLimit: ethers.utils.hexlify(30000000),
              // gasPrice: BigNumber.from(50000000000),
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      } else {
        await Router.connect(signer)
          .removeLiquidity(
            token1.address,
            token2.address,
            value,
            "0",
            "0",
            account,
            deadline,
            {
              gasLimit: ethers.utils.hexlify(30000000),
              // gasPrice: BigNumber.from(50000000000),
            }
          )
          .then(() => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
    } catch (err) {
      console.log(err);
    }
  };

  // LP token is pool address (extended ERC20)
  const getLiq = async () => {
    try {
      const token1Contract = await getTokenContract(token1.address);
      const pool = await getPoolContract();
      if (pool.address == "0x0000000000000000000000000000000000000000") {
        setToken1Liq("0");
        setToken2Liq("0");
        setLPAmount("0");
      } else {
        await token1Contract.balanceOf(pool.address).then((res) => {
          setToken1Liq(Number(ethers.utils.formatEther(res)));
        });
        const token2Contract = await getTokenContract(token2.address);
        token2Contract.balanceOf(pool.address).then((res) => {
          setToken2Liq(Number(ethers.utils.formatEther(res)));
        });
        const myLiq = await pool.balanceOf(account);
        setLPAmount((myLiq.toString() / 1e18).toFixed(5));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTokenBRequired = async (inputAmount) => {
    try {
      const amountIn = ethers.utils.parseEther(inputAmount);
      console.log("amountin", amountIn);
      const pool = await getPoolContract();
      if (pool.address == "0x0000000000000000000000000000000000000000") {
        console.log("1");
        const tokenBRequired = (amountIn.toString() / 1e18).toFixed(5);
        console.log("tokenbreq1", tokenBRequired);
        return tokenBRequired;
      } else {
        console.log("2");
        const reserves = await pool.getReserves();
        // dy = dx/x * y
        console.log("reserves", reserves[0].toString(), reserves[1].toString());
        const tokenBRequired = (
          ((amountIn.toString() / reserves[1]) * reserves[0]) /
          1e18
        ).toFixed(5);
        return tokenBRequired;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (e) => {
    let inputAmount;
    if (e == "") {
      inputAmount = "0";
      setInputAmount("0");
    } else {
      inputAmount = e;
      setInputAmount(e);
    }
    const tokenB = await getTokenBRequired(inputAmount);
    setTokenBRequired(tokenB);
  };

  useEffect(() => {
    const loadPage = async () => {
      await getPoolAddress();
      await getPoolContract();
      await getLiq();
      // await getReserves();
      const dl = Math.floor(Date.now() / 1000 + 10 * 60);
      setDeadline(dl);
      getRouterContract();
    };
    loadPage();
  }, []);

  useEffect(() => {
    const loadLiq = async () => {
      await getLiq();
      await getTokenBRequired();
    };
    loadLiq();
  }, [token1, token2]);

  return (
    <animated.div
      className="flex flex-col items-center sm:mt-16 font-kanit"
      style={springs}
    >
      <div className="flex md:flex-row flex-col justify-around align-top shadow-2xl">
        <div className="flex flex-col justify-between bg-red-600 p-4 rounded-xl h-fit md:mr-32">
          <h1 className="mb-2 ml-4 text-white font-bold text-xl font-rubik">
            Add liquidity
          </h1>
          <hr />
          <h2 className="mb-4 mt-4 text-white text-center">Choose assets</h2>
          <div className="flex flex-row justify-center mb-3 flex-wrap">
            {loading ? (
              <div className="ml-4 mt-2">
                <BeatLoader />
              </div>
            ) : (
              <div className="basis-2/4">
                <div className="flex flex-row">
                  <div className="mr-2 flex items-center font-semibold">
                    <select
                      onChange={(event) =>
                        setToken1(tokenlist[event.target.value])
                      }
                      className="bg-transparent align-middle"
                    >
                      <option value="0">REE</option>
                      <option value="1">LEE</option>
                      <option value="2">ETH</option>
                    </select>
                  </div>
                  <input
                    placeholder="0.0"
                    onChange={async (e) => await handleChange(e.target.value)}
                    className="rounded-2xl pl-2 outline-none py-2 w-20 sm:w-44"
                  />
                </div>
                <div className="flex flex-row mt-2 mb-2">
                  <div className="flex items-center mr-2 font-semibold">
                    <select
                      onChange={(event) =>
                        setToken2(tokenlist[event.target.value])
                      }
                      className="bg-transparent"
                    >
                      <option value="1">LEE</option>
                      <option value="0">REE</option>
                      <option value="2">ETH</option>
                    </select>
                  </div>
                  <div className="bg-white rounded-2xl p-2 w-20 sm:w-44">
                    {tokenBRequired && inputAmount ? tokenBRequired : 0}
                  </div>
                </div>
              </div>
            )}
            <button
              className="bg-white ml-4 rounded-xl hover:bg-black hover:text-white h-10 w-fit px-2 flex-wrap"
              onClick={async () =>
                await addLiquidity({
                  onSuccess: handleSuccess,
                  onError: (err) => console.log(err),
                })
              }
            >
              Add liquidity
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-red-600 p-4 rounded-xl h-fit md:ml-32 md:mt-0 mt-4">
          <h1 className="mb-2 ml-4 text-white font-bold text-xl font-rubik">
            Remove liquidity
          </h1>
          <hr />
          <div className="flex justify-center mt-4 text-white font-bold">
            {token1.name} - {token2.name}
          </div>
          <div className="flex flex-row justify-center mt-4 flex-wrap">
            <div>
              <input
                placeholder="0.0"
                onChange={(e) => setRemoveAmount(e.target.value)}
                className="rounded-2xl pl-2 outline-none py-2 w-20 basis-1/4 sm:w-44"
                value={removeAmount || ""}
              />
              <div
                className="flex justify-center mr-2 text-xs hover:font-bold mb-2"
                onClick={() => setRemoveAmount(LPAmount)}
              >
                Your LP tokens: {LPAmount}
              </div>
            </div>

            <button
              onClick={async () =>
                await removeLiquidity({
                  onSuccess: handleSuccess,
                  onError: (err) => console.log(err),
                })
              }
              className="bg-white mr-4 rounded-xl hover:bg-black hover:text-white h-10 ml-4 w-fit px-2"
            >
              Remove liquidity
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col mt-8 py-4 px-8 text-center bg-red-600 w-fit rounded-xl text-white shadow-2xl">
        <h1 className="font-bold text-2xl font-rubik mb-2">Pool Liquidity:</h1>
        <hr />
        <div className="mt-2">
          {token1.name}
          {token1Liq ? <div>{token1Liq}</div> : <div>0</div>}
        </div>
        <div>
          {token2.name}
          {token2Liq ? <div>{token2Liq}</div> : <div>0</div>}
        </div>
      </div>
    </animated.div>
  );
};

export default AddPool;
