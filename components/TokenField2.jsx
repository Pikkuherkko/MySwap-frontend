import React from "react";
import tokenlist from "./constants/tokenlist";

const TokenField2 = (props) => {
  return (
    <div className="bg-red-100 flex flex-row mt-4 rounded-xl p-2 justify-between font-kanit">
      <div className="mt-2">
        {props.loading ? (
          <div className="mt-2">
            <props.spinner />
          </div>
        ) : (
          <input
            placeholder="0.0"
            defaultValue={props.value || ""}
            className="bg-red-100 ml-4 text-xl inline focus:outline-none w-1/2"
          />
        )}
      </div>
      <div className="flex flex-col mr-2">
        <span className="text-xl font-semibold inline text-end">
          <select
            onChange={(event) => props.setToken2(tokenlist[event.target.value])}
            className="bg-transparent"
          >
            <option value="1">LEE</option>
            <option value="0">REE</option>
            <option value="2">ETH</option>
          </select>
        </span>
        <div className="flex flex-row">
          <div className="text-sm mr-1 ">Balance:</div>
          <div className="text-sm ">{props.balance?.toFixed(3)}</div>
        </div>
      </div>
    </div>
  );
};

export default TokenField2;
