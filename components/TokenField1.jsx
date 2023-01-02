import React, { useState, useEffect } from "react";
import tokenlist from "./constants/tokenlist";

const TokenField1 = (props) => {
  const [value, setValue] = useState(undefined);
  const [tokenList, setTokenList] = useState([]);
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };

  const handleChange = (e) => {
    setValue(e);
    getPrice(e);
  };

  const getTokenlist = async () => {
    const response = await fetch("api/tokens", {
      method: "GET",
    });
    const data = await response.json();
    console.log("res", data);
    setTokenList(data);
  };

  useEffect(() => {
    const loadTokens = async () => {
      await getTokenlist();
    };
    loadTokens();
  }, []);

  console.log("tokenlist", tokenList);

  return (
    <div className="bg-red-100 flex flex-row mt-4 rounded-xl p-2 justify-between font-kanit">
      <div className="mt-2 ">
        <input
          placeholder="0.0"
          onChange={(e) => handleChange(e.target.value)} // setting up inputAmount
          value={value || ""}
          className="bg-red-100 ml-4 text-xl inline focus:outline-none w-1/2"
        />
      </div>
      <div className="flex flex-col mr-2">
        <span className="text-xl font-semibold inline ">
          <select
            onChange={(event) => props.setToken1(tokenlist[event.target.value])}
            className="bg-transparent text-end"
          >
            {tokenlist.map((token, idx) => (
              <option key={idx} value={idx} className="">
                {token.name}
              </option>
            ))}
            {/* <option value="0">REE</option>
            <option value="1">LEE</option>
            <option value="2">ETH</option> */}
          </select>
        </span>
        <div className="flex flex-row justify-end">
          <div className="text-sm mr-1">Balance:</div>
          <div
            className="text-sm hover:font-bold "
            onClick={() => handleChange(props.balance.toString())}
          >
            {props.balance?.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenField1;
