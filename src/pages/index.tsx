import { type NextPage } from "next";
import Head from "next/head";
import { z } from "zod";
import CopyButton from "~/components/CopyButton";
import Navbar from "~/components/Navbar";
import { Transaction } from "~/server/api/routers/web3";
import { ethers } from "ethers";
import { api } from "~/utils/api";

type Transaction = z.infer<typeof Transaction>;

let tableHeaders = ["Txn Hash", "Block", "Age", "From", "To", "Value"] as const;

const Home: NextPage = () => {
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
      api.web3.transactions.useQuery({
        address: addressToFetchFrom,
      });

    if (!transactionsData) return <div></div>;

    let transactions = transactionsData.transactions;

    return (
      <table className="border-collapse bg-white shadow-lg">
        <tr>
          {tableHeaders.map((h) => (
            <th className="border bg-blue-100 px-8 py-4 text-left">{h}</th>
          ))}
        </tr>
        {transactions.map((t) => (
          <tr>
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
      </table>
    );
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
        <div className="p-4"></div>
        <Transactions addressToFetchFrom="0x459DDB554B6c85Cf1635216A271210D98c39a35C"></Transactions>
      </div>
    </>
  );
};

export default Home;
