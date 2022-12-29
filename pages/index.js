import { useMoralis } from "react-moralis";
import NavBar from "../components/NavBar";
import Swap from "../components/Swap";
import Footer from "../components/Footer";

export default function MySwap() {
  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="sm:bg-[url('my-app/pictures/eth.jpeg')] sm:bg-cover bg-black w-full ">
      <div className="bg-black w-[40%] h-[60%] top-60 right-[5%] blur-[100px] rounded-full absolute z-[0] object-cover"></div>
      <div className="flex flex-col justify-between h-screen">
        <NavBar />
        {isWeb3Enabled ? (
          <>
            <div className="">
              <Swap />
            </div>
          </>
        ) : (
          <div className="text-3xl font-bold flex justify-center sm:mt-20 animate-bounce">
            <div className="bg-red-600 text-white p-10 rounded-xl">
              Please connect wallet
            </div>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
