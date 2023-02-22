import { type NextPage } from "next";
import Head from "next/head";
import { z } from "zod";
import CopyButton from "~/components/CopyButton";
import Navbar from "~/components/Navbar";
import { ethers } from "ethers";
import { api } from "~/utils/api";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocal from "dayjs/plugin/updateLocale";
import { Transaction } from "~/server/api/routers/web3";

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

type Transaction = z.infer<typeof Transaction>;

const tableHeaders = [
  "Txn Hash",
  "Block",
  "Age",
  "From",
  "To",
  "Value",
] as const;

const limitOptions = [5, 10, 25, 50, 100];

const Home: NextPage = () => {
  // React state for variables that need it
  const [limit, setLimit] = useState(5);
  const [address, setAddress] = useState("");
  const [block, setBlock] = useState("");
  const [addressToFetch, setAddressToFetch] = useState("");
  const [blockToFetch, setBlockToFetch] = useState(0);

  // Takes an address and fetches and later renders all transactions from the address
  const Transactions: React.FC<{
    addressToFetchFrom: string;
    blockToFetchFrom: number;
  }> = ({ addressToFetchFrom, blockToFetchFrom }) => {
    // Fetch transactions with tRPC infinite query from our router
    const {
      data: transactionsData,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
    } = api.web3.transactions.useInfiniteQuery(
      {
        address: addressToFetchFrom,
        block: blockToFetchFrom,
        limit: limit,
      },
      {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        getNextPageParam: (lastPage) => lastPage.nextCursorBlock,
      }
    );

    // If we dont get anything back - dont render anything
    if (!transactionsData) return <div></div>;

    // Flatten the infinite query result
    const transactions = transactionsData.pages
      .map((p) => p.transactions)
      .flat();

    // Render the table with transactions
    return (
      <>
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
                  <div className="flex flex-row items-center justify-between">
                    <span className="pr-2">{t.hash.substring(0, 15)}...</span>
                    <CopyButton text={t.hash}></CopyButton>
                  </div>
                </td>
                <td className="border px-8 py-4">{t.blockNumber}</td>
                <td className="border px-8 py-4">
                  {dayjs.unix(parseInt(t.timeStamp)).fromNow()}
                </td>
                <td className="border px-8 py-4">
                  <div className="flex flex-row items-center justify-between ">
                    <span className="pr-2">{t.from.substring(0, 10)}...</span>
                    <CopyButton text={t.from}></CopyButton>
                  </div>
                </td>
                <td className="cursor-pointer border px-8 py-4">
                  <div className="flex flex-row items-center justify-between ">
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
        {hasNextPage && (
          <>
            <div className="p-4"></div>
            <button
              disabled={isFetchingNextPage || isLoading}
              className="rounded-full bg-blue-400 py-2 px-4 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={async () => await fetchNextPage()}
            >
              Load more
            </button>
          </>
        )}
      </>
    );
  };

  // Change the stateful variables which will cause the Transactions component to re-render and do another api call with the new parameters
  const showTransactions = () => {
    if (/^\d+$/.test(block) && ethers.isAddress(address)) {
      setAddressToFetch(address);
      setBlockToFetch(parseInt(block));
    }
  };

  // Render the whole page
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
        <div className="flex flex-row items-center justify-center">
          <div className="text-lg font-semibold">
            Show transactions for Ethereum address:
          </div>
          <div className="p-2"></div>
          <div className="flex flex-col items-center justify-center">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          <div className="text-lg font-semibold">Starting from block:</div>
          <div className="p-2"></div>
          <div className="flex flex-col items-center justify-center">
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setBlock(e.target.value);
              }}
              className="focus:shadow-outline w-96 rounded-lg border border-blue-300 bg-gray-100 py-2 px-3 leading-tight shadow focus:outline-none"
            ></input>
            {!/^\d+$/.test(block) && (
              <span className="text-red-500">
                Please enter a valid Ethereum block
              </span>
            )}
          </div>
        </div>
        <div className="p-4"></div>
        <div className="flex flex-row items-center justify-center">
          <div className="text-lg font-semibold">Show per page:</div>
          <div className="p-2"></div>
          <select
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setLimit(parseInt(e.target.value));
            }}
            className="focus:shadow-outline rounded-lg border border-blue-300 bg-gray-100 py-2 px-3 leading-tight shadow focus:outline-none"
          >
            {limitOptions.map((lo) => (
              <option key={lo} value={lo}>
                {lo}
              </option>
            ))}
          </select>
        </div>
        <div className="p-4"></div>
        <button
          className="rounded-full bg-blue-400 py-2 px-4 font-bold text-white hover:bg-blue-700"
          onClick={showTransactions}
        >
          Show
        </button>
        <div className="p-4"></div>
        <Transactions
          addressToFetchFrom={addressToFetch}
          blockToFetchFrom={blockToFetch}
        ></Transactions>
      </div>
    </>
  );
};

export default Home;
