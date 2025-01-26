"use client";

import React from "react";
import { Footer } from "flowbite-react";
import Link from "next/link";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsGithub,
  BsTiktok,
  BsDribbble,
} from "react-icons/bs";

// Component
const FooterComp: React.FC = () => {
  return (
    <Footer container className="border border-t-8 border-orange-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              href="/"
              className="self-center whitespace-nowrap text-lg sm-text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-pink-500 rounded-lg text-white">
                Cro{"\u0301"}nicas del Vejerete
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Acerca" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.excelsolutionsv.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Excel SolutionsV
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cro{"\u0301"}nicas.
                </Footer.Link>
                <Footer.Link href="/contact">Contacto</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Redes Sociales" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/svei00/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </Footer.Link>
                <Footer.Link
                  href="https://www.youtube.com/svei00"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="/privacy">Privacidad</Footer.Link>
                <Footer.Link href="/terms">Términos y Condiciones</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Ivan E. Villanueva"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="https://github.com/svei00/" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsTwitterX} />
            <Footer.Icon href="#" icon={BsTiktok} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
