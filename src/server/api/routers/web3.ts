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
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${input.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.ETHERSCAN_API_KEY}`;

      if (!apiUrl) return { transactions: [] };

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //@ts-ignore
      const transactions: z.infer<typeof Transaction>[] = (
        await response.json()
      ).result;

      return {
        transactions,
      };
    }),
});
