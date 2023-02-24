import Head from "next/head";
import Link from "next/link";
import { Inter } from "@next/font/google";
import LandingHeader from "@/components/LandingHeader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Title</title>
        <meta name="description" content="Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LandingHeader />

      <div className="text-center">
        <div>
          <h1 className="text-5xl md:text-7xl text-gray-900 dark:text-white font-extrabold mb-5">
            Make your website
          </h1>
        </div>
        <div>
          <span className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            wonderful
          </span>
        </div>
        <div className="max-w-3xl mx-auto mt-9">
          <p className="text-xl text-gray-400">
            Our landing page template works on all devices, so you only have to
            set it up once, and get beautiful results forever.
          </p>
          <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center mt-12">
            <div>
              <a href="#0">
                <button
                  type="button"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Read the docs
                </button>
              </a>
            </div>
            <div>
              <a href="#0">
                <button
                  type="button"
                  class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                  Join the discord
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
