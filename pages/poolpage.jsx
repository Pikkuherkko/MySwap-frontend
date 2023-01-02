import { useMoralis } from "react-moralis";
import NavBar from "../components/NavBar";
import AddPool from "../components/AddPool";
import Footer from "../components/Footer";

export default function MySwap() {
  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="sm:bg-eth sm:bg-cover bg-black bg-scroll overflow-auto">
      <div className="bg-black w-[40%] h-[60%] top-60 right-[5%] blur-[100px] rounded-full absolute z-[0] object-cover"></div>
      <div className="flex flex-col justify-between h-screen lg:mx-0 mx-4">
        <NavBar />
        {isWeb3Enabled ? (
          <>
            <div className="">
              <AddPool />
            </div>
          </>
        ) : (
          <div className="text-3xl font-bold flex justify-center mt-20 animate-bounce">
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
