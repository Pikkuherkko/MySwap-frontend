import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import unilogo from "../pictures/unilogo.svg";
import { links } from "./constants/links";
import { socialMedia } from "./constants";

const Footer = () => (
  <section className="font-kanit flex flex-col sm:mt-0 mt-4">
    <div className="flex sm:flex-row flex-col">
      <div className="ml-12 basis-1/3 flex flex-col justify-end mb-4">
        <div className="flex flex-row items-center">
          <p className="text-slate-300 text-xs ">
            Smart contract design by Uniswap Labs
          </p>
          <Image src={unilogo} alt="unilogo" width={30} height={30} />
        </div>
        <p className="text-slate-300 text-xs flex items-center">
          Contracts manually updated to ^0.8.4. Do not fork!
        </p>
      </div>
      <div className="flex flex-row kanit z-[1] mb-2">
        {links.map((set, index) => (
          <div key={index} className="flex flex-col leading-7 ml-20">
            <h2 className="text-white font-semibold text-lg">{set.title}</h2>
            <ul className="">
              {set.links.map((link, index) => (
                <Link key={index} href={link.link} target="_blank">
                  <li className="text-slate-300 hover:text-cyan-900 cursor-pointer text-sm">
                    {link.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-row justify-between items-center mx-12 border-t-[1px] p-2">
      <p className="text-slate-300 font-semibold font-rubik sm:text-base text-sm">
        2022 Pikkuherkko
      </p>
      <div className="flex flex-row">
        {socialMedia.map((site, index) => (
          <div key={index} className="ml-6 object-contain cursor-pointer">
            <Link passHref href={site.link} target="_blank">
              <Image
                key={site.id}
                src={site.icon}
                alt="icon"
                href={site.link}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
