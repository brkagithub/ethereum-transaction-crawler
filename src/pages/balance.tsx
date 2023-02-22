import dayjs from "dayjs";
import { ethers } from "ethers";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

const Balance: NextPage = () => {
  const [address, setAddress] = useState("");
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);

  // tRPC query to retrieve balance at timestamp
  const { data: balanceData } = api.web3.balance.useQuery({
    address,
    timestamp,
  });

  // Render the whole page
  return (
    <>
      <Head>
        <title>Ethereum web crawler - historical balance</title>
        <meta
          name="description"
          content="Ethereum web crawler made for Trace Labs internship."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-2 pt-2 sm:px-6 lg:px-8">
        <Navbar></Navbar>
        <div className="p-4"></div>
        <div className="flex flex-row items-center justify-center">
          <div className="text-lg font-semibold">
            Show balance for Ethereum address:
          </div>
          <div className="p-2"></div>
          <div className="flex flex-col items-center justify-center">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (ethers.isAddress(e.target.value))
                  setAddress(e.target.value);
              }}
              className="focus:shadow-outline w-96 rounded-lg border border-blue-300 bg-gray-100 py-2 px-3 leading-tight shadow focus:outline-none"
            ></input>
            {!ethers.isAddress(address) && (
              <span className="text-red-500">
                Please enter a valid Ethereum address
              </span>
            )}
          </div>
        </div>
        <div className="p-4"></div>
        <div className="flex flex-row items-center justify-center">
          <div className="text-lg font-semibold">Available at date:</div>
          <div className="p-2"></div>
          <div className="flex flex-col items-center justify-center">
            <input
              type="date"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTimestamp(dayjs(e.target.value).unix());
              }}
              className="focus:shadow-outline w-96 rounded-lg border border-blue-300 bg-gray-100 py-2 px-3 leading-tight shadow focus:outline-none"
            ></input>
            {!timestamp && (
              <span className="text-red-500">Please enter a date</span>
            )}
          </div>
        </div>
        <div className="p-4"></div>
        {balanceData && (
          <div className="text-lg font-semibold text-blue-700">
            Your current balance is: {balanceData}
          </div>
        )}
      </div>
    </>
  );
};

export default Balance;
