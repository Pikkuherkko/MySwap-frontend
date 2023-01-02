import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import Link from "next/link";

export default function NavBar() {
  const { isWeb3Enabled, enableWeb3, account, deactivateWeb3 } = useMoralis();

  useEffect(() => {
    try {
      if (
        !isWeb3Enabled &&
        typeof window !== "undefined" &&
        window.localStorage.getItem("connected")
      ) {
        // await enableWeb3();
        const switchToCorrectChain = async () => {
          const web3Provider = await enableWeb3();
          try {
            await web3Provider.provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            });
          } catch (error) {
            console.log(error);
          }
        };
        switchToCorrectChain();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isWeb3Enabled]);

  const disconnect = async () => {
    window.localStorage.removeItem("connected");
    deactivateWeb3();
  };

  return (
    <div className="relative">
      <div className="flex sm:flex-row flex-col sm:justify-between justify-center items-center p-2">
        <div>
          <h1 className="mt-2 ml-4 text-3xl text-white font-rubik sm:mb-0 mb-4">
            MySwap
          </h1>
        </div>
        <div className="flex flex-row bg-red-600 rounded-2xl p-2 text-white px-8 shadow-2xl font-kanit w-fit sm:mb-0 mb-2">
          <Link href="/" className="mr-2 hover:text-black font-semibold">
            Swap
          </Link>
          <Link
            href="/poolpage"
            className="mx-2 hover:text-black font-semibold"
          >
            Pool
          </Link>
          <Link
            href="/toptokens"
            className="ml-2 hover:text-black font-semibold"
          >
            Tokens
          </Link>
        </div>
        {account ? (
          <button
            className="w-30 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-black hover:text-red-600 font-kanit"
            onClick={() => disconnect()}
          >
            Connected
          </button>
        ) : (
          <button
            onClick={async () => {
              const res = await enableWeb3();
              if (typeof res !== "undefined") {
                if (typeof window !== "undefined") {
                  window.localStorage.setItem("connected", "injected");
                }
              }
            }}
            className="w-24 bg-red-800 text-white p-2 rounded-xl hover:bg-black hover:text-red-600 animate-pulse font-kanit"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
