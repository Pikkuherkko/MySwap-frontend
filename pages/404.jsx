import { useMoralis } from "react-moralis";
import Image from "next/image";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import notFound from "../pictures/404.png";

export default function MySwap() {
  return (
    <div className="sm:bg-eth sm:bg-cover bg-black bg-scroll overflow-auto">
      <div className="bg-black w-[40%] h-[60%] top-60 right-[5%] blur-[100px] rounded-full absolute z-[0] object-cover"></div>
      <div className="flex flex-col justify-between h-screen">
        <NavBar />

        <>
          <div className="flex justify-center items-center flex-col">
            <Image src={notFound} width={200} height={200} className="" />
            <h1 className="text-white text-4xl font-rubik">404</h1>
          </div>
        </>

        <Footer />
      </div>
    </div>
  );
}
