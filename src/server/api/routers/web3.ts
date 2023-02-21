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
        cursorBlock: z.number(),
        limit: z.number().min(5).max(100).default(10),
      })
    )
    .query(async ({ input }) => {
      const { cursorBlock, limit, address } = input;

      if (!Number.isInteger(cursorBlock) || !ethers.isAddress(address))
        return { transactions: [] };

      const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${cursorBlock}&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const transactions: z.infer<typeof Transaction>[] = (
        await response.json()
      ).result;

      return {
        transactions,
      };
    }),
});
