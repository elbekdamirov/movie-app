import { memo } from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { MdOutlineLocalMovies, MdTheaters } from "react-icons/md";
import { TbMicrophone2 } from "react-icons/tb";
import { GiBasketballBall } from "react-icons/gi";
import { RiAdvertisementFill } from "react-icons/ri";
import { FaQuestionCircle } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

import playmarket from "@/shared/assets/play.png";
import footerlogo from "@/shared/assets/logo.svg";
import appstore from "@/shared/assets/appstore.svg";

export const Footer = memo(() => {
  return (
    <footer className=" dark:text-gray-300 py-10 dark:bg-black">
      <div className="container mx-auto  rounded-xl px-6 py-10 grid grid-cols-2 sm:justify-center sm:grid-cols-2 md:grid-cols-4 gap-8 dark:bg-[#111111] bg-[#eeecec]">
        <div className="space-y-4">
          <img src={footerlogo} alt="footerlogo" className="w-24" />
          <div className="flex flex-col gap-3">
            <img
              src={playmarket}
              alt="Google Play"
              className="w-36 cursor-pointer hover:opacity-80 transition"
            />
            <img
              src={appstore}
              alt="App Store"
              className="w-36 cursor-pointer hover:opacity-80 transition"
            />
          </div>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold mb-4">About Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <IoDocumentTextOutline /> Public Offer
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <RiAdvertisementFill /> Advertising
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <FaQuestionCircle /> F.A.Q
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdContactPhone /> Contacts
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold mb-4">Categories</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdOutlineLocalMovies /> Movies
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdTheaters /> Theater
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <TbMicrophone2 /> Concerts
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <GiBasketballBall /> Sports
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold mb-4">Contact Us</h3>
          <p className="text-red-500 font-semibold mb-4">+998 (91) 012-20-77</p>
          <h3 className="text-red-500 font-semibold mb-3">Follow Us</h3>
          <div className="flex text-red-500 space-x-4 text-2xl">
            <a href="#" className="hover:text-red-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-red-500">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-red-500">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});
