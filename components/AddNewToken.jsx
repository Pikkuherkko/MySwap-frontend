import { useState } from "react";
import { useSpring, useTransition, animated } from "@react-spring/web";
import { getTokenContract } from "./ethFunctions";

const AddNewToken = () => {
  const [name, setName] = useState(undefined);
  const [symbol, setSymbol] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [isHidden, setIsHidden] = useState(true);
  const [springs] = useSpring(() => ({
    from: { y: 100, x: -100, opacity: 0 },
    to: {
      y: 0,
      x: 0,
      opacity: 0.95,
    },
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name || !symbol || !address) {
        return console.error("Invalid token");
      }
      const newTokenContract = await getTokenContract(address);
      const totalSupply = await newTokenContract.totalSupply();
      console.log("newww", totalSupply);
      if (!totalSupply) {
        return console.error("Token not found");
      }
      const response = await fetch("api/tokens", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          symbol: symbol,
          decimals: 18,
          address: address,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(name);
  return (
    <div className="flex justify-center relative">
      <animated.div
        className="bg-red-600 p-4 rounded-2xl relative sm:w-96 w-96"
        style={springs}
      >
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-between items-center font-rubik">
            <h1 className="text-white mb-4">Add new token</h1>
            <button
              className="text-white font-kanit"
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? "Open" : "Close"}
            </button>
          </div>

          <div
            className={`flex flex-col font-kanit text-white text-sm sm:text-lg ${
              isHidden ? "hidden" : "flex justify-center"
            }`}
          >
            <div className="flex flex-row mb-2 ">
              <h2 className="mr-4 flex items-center basis-1/2">Token name:</h2>
              <input
                type="text"
                className=" text-black text-sm w-40 rounded-xl p-2 flex items-center outline-none basis-1/2"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-row mb-2">
              <h2 className="mr-4 flex items-center basis-1/2">
                Token symbol:
              </h2>
              <input
                type="text"
                className="text-black text-sm w-40 rounded-xl p-2 flex items-center outline-none basis-1/2"
                onChange={(e) => setSymbol(e.target.value)}
              />
            </div>
            <div className="flex flex-row mb-2">
              <h2 className="mr-4 flex items-center basis-1/2">
                Token address:
              </h2>
              <input
                type="text"
                className="text-black text-sm w-40 rounded-xl p-2 flex items-center outline-none basis-1/2"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              className="bg-white rounded-2xl py-2 mt-2 hover:bg-black hover:text-white font-kanit text-black"
              onClick={handleSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default AddNewToken;
