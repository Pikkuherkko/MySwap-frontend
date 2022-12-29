import React from "react";

const Settings = (props) => {
  const {
    onClose,
    setDeadlineMinutes,
    deadlineMinutes,
    setSlippageAmount,
    slippageAmount,
  } = props;
  const onClickHandler = () => {
    onClose();
  };
  return (
    <div className="fixed " onClick={() => onClickHandler()}>
      <div className="bg-white text-black p-4 rounded-2xl border-black border-2 kanit">
        <div>
          <div>
            <h2 className="font-bold mb-2">Transaction settings</h2>
          </div>
          <div>Slippage tolerance</div>
          <div
            className="flex flex-row my-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              placeholder="1.0%"
              value={slippageAmount}
              onChange={(event) => setSlippageAmount(event.target.value)}
              className="border-red-100 border-2 rounded-2xl pl-2"
            />
            <div className="ml-2">%</div>
          </div>
          <div>Transaction deadline</div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-row my-2"
          >
            <div>
              <input
                placeholder="10"
                value={deadlineMinutes}
                onChange={(event) => setDeadlineMinutes(event.target.value)}
                className="border-red-100 border-2 rounded-xl pl-2"
              />
            </div>
            <div className="ml-2">min</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
