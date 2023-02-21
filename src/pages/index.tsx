import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "~/components/Navbar";

import { api } from "~/utils/api";

type Transaction = {
  hash: string;
  blockNumber: string;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  //txnfee/gas/?
};

const Home: NextPage = () => {
  const hello = api.web3.hello.useQuery({ text: "from tRPC" });

  const Transactions: React.FC<{}> = ({}) => {
    return <div>transactions</div>;
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
      </div>
    </>
  );
};

export default Home;
