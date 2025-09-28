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
import { useTranslation } from "react-i18next";

export const Footer = memo(() => {
  const { t } = useTranslation();
  return (
    <footer className="dark:text-gray-300 py-10 dark:bg-black">
      <div className="container mx-auto rounded-xl px-6 py-10 grid grid-cols-2 sm:justify-center sm:grid-cols-2 md:grid-cols-4 gap-8 dark:bg-[#111111] bg-[#eeecec]">
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
          <h3 className="text-red-500 font-semibold mb-4">
            {t("footer.about.title")}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <IoDocumentTextOutline /> {t("footer.about.publicOffer")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <RiAdvertisementFill /> {t("footer.about.advertising")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <FaQuestionCircle /> {t("footer.about.faq")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdContactPhone /> {t("footer.about.contacts")}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold mb-4">
            {t("footer.categories.title")}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdOutlineLocalMovies /> {t("footer.categories.movies")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <MdTheaters /> {t("footer.categories.theater")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <TbMicrophone2 /> {t("footer.categories.concerts")}
            </li>
            <li className="flex items-center text-red-700 gap-2 hover:text-red-500 cursor-pointer">
              <GiBasketballBall /> {t("footer.categories.sports")}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-red-500 font-semibold mb-4">
            {t("footer.contact.title")}
          </h3>
          <p className="text-red-500 font-semibold mb-4">
            {t("footer.contact.phone")}
          </p>
          <h3 className="text-red-500 font-semibold mb-3">
            {t("footer.contact.follow")}
          </h3>
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
