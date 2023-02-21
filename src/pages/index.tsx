import { type NextPage } from "next";
import Head from "next/head";
import { z } from "zod";
import CopyButton from "~/components/CopyButton";
import Navbar from "~/components/Navbar";
import { Transaction } from "~/server/api/routers/web3";
import { ethers } from "ethers";
import { api } from "~/utils/api";
import { KeyboardEvent, useState } from "react";

type Transaction = z.infer<typeof Transaction>;

const tableHeaders = [
  "Txn Hash",
  "Block",
  "Age",
  "From",
  "To",
  "Value",
] as const;

const Home: NextPage = () => {
  const [address, setAddress] = useState("");

  // Takes a transaction object and renders it as a card

  const TransactionCard: React.FC<{ t: Transaction }> = ({ t }) => {
    return <div>transaction</div>;
  };

  // Takes an address and fetches and later renders all transactions from the address
  const Transactions: React.FC<{ addressToFetchFrom: string }> = ({
    addressToFetchFrom,
  }) => {
    // Fetch transactions with tRPC query from our router
    const { data: transactionsData, isLoading } =
      api.web3.transactions.useQuery(
        {
          address: addressToFetchFrom,
        },
        { refetchOnWindowFocus: false }
      );

    if (
      !transactionsData ||
      !transactionsData.transactions ||
      typeof transactionsData.transactions === "string"
    )
      return <div></div>;

    const transactions = transactionsData.transactions;

    return (
      <table className="border-collapse bg-white shadow-lg">
        <tbody>
          <tr>
            {tableHeaders.map((h) => (
              <th key={h} className="border bg-blue-100 px-8 py-4 text-left">
                {h}
              </th>
            ))}
          </tr>
          {transactions.map((t) => (
            <tr key={t.hash}>
              <td className="border px-8 py-4">
                <div className="flex cursor-pointer flex-row items-center justify-between ">
                  <span className="pr-2">{t.hash.substring(0, 15)}...</span>
                  <CopyButton text={t.hash}></CopyButton>
                </div>
              </td>
              <td className="border px-8 py-4">{t.blockNumber}</td>
              <td className="border px-8 py-4">{t.timeStamp}</td>
              <td className="border px-8 py-4">
                <div className="flex cursor-pointer flex-row items-center justify-between ">
                  <span className="pr-2">{t.from.substring(0, 10)}...</span>
                  <CopyButton text={t.from}></CopyButton>
                </div>
              </td>
              <td className="cursor-pointer border px-8 py-4">
                <div className="flex cursor-pointer flex-row items-center justify-between ">
                  <span className="pr-2">{t.to.substring(0, 10)}...</span>
                  <CopyButton text={t.to}></CopyButton>
                </div>
              </td>
              <td className="border px-8 py-4">
                {ethers.formatEther(t.value)} ETH
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.charCode !== 13) {
      return;
    }
    const target = e.target as HTMLInputElement;
    setAddress(target.value);
  };

  return (
    <>
      <Head>
        <title>Ethereum web crawler</title>
        <meta
          name="description"
          content="Ethereum web crawler made for Trace Labs internship."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-2 pt-2 sm:px-6 lg:px-8">
        <Navbar></Navbar>
        <div>To do: validate on frontend eth address</div>
        <div className="p-4"></div>
        <div className="flex flex-row items-center justify-center">
          <div className="text-lg font-semibold">
            Show transactions for ethereum address (click enter to show):
          </div>
          <div className="p-2"></div>
          <input
            onKeyPress={handleKeyPress}
            className="focus:shadow-outline w-96 rounded-lg border border-blue-300 bg-gray-100 py-2 px-3 leading-tight shadow focus:outline-none"
          ></input>
        </div>
        <div className="p-4"></div>
        <Transactions addressToFetchFrom={address}></Transactions>
      </div>
    </>
  );
};

export default Home;
