import { ethers } from "ethers";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const Transaction = z.object({
  hash: z.string(),
  blockNumber: z.string(),
  timeStamp: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
});

export const web3Router = createTRPCRouter({
  transactions: publicProcedure
    .input(
      z.object({
        address: z.string(),
        cursor: z.number().nullish(),
        block: z.number().nullish(),
        limit: z.number().min(5).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, address, block } = input;

      // Return empty array in case of incorrect parameters
      if (!Number.isInteger(block) || !ethers.isAddress(address))
        return { transactions: [] };

      // Construct API URL
      const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${block}&endblock=${
        cursor ? cursor : 99999999
      }&page=1&offset=${limit + 1}&sort=desc&apikey=${
        process.env.ETHERSCAN_API_KEY
      }`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Get transaction from the api response result
      const transactions: z.infer<typeof Transaction>[] = (
        await response.json()
      ).result;

      let nextCursorBlock: typeof cursor | undefined = undefined;

      // If there are more transactions than the limit, set the next cursor block
      if (transactions.length > limit) {
        const nextTransaction = transactions.pop() as (typeof transactions)[0];
        nextCursorBlock = parseInt(nextTransaction.blockNumber);
      }

      // Return an object with the transactions and the next cursor block
      return {
        transactions,
        nextCursorBlock,
      };
    }),
});
