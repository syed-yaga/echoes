import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

export default function FooterCom() {
  return (
    <Footer
      container
      className="border-t-8 border-teal-500 bg-[#1e2633] text-gray-300 py-8 mt-auto"
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between relative">
        <div className="w-full flex justify-start sm:justify-start">
          <Link
            to={"/"}
            className="text-sm sm:text-xl font-semibold sm:ml-4 sm:-mt-6"
          >
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white shadow-lg">
              Echoes
            </span>
          </Link>
        </div>

        <div className="w-full sm:w-auto mt-4 sm:mt-0 text-left sm:text-right flex-1">
          <h3 className="text-white font-semibold mb-3 text-lg">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full sm:hidden mt-4 text-sm text-gray-500 text-left">
          © {new Date().getFullYear()} Echoes.co, All rights reserved.
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-2 left-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Echoes.co, All rights reserved.
      </div>
    </Footer>
  );
}
