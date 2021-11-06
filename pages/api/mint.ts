import { NextApiRequest, NextApiResponse } from "next";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

/**
 * Questions for Jonas:
 *
 * - Should the minting itself be done on the server side or the client side?
 *   Not sure how this works with regards to gas fees etc.
 *
 * - Not sure if we should use a collection module at all, since I'm not sure
 *   if identical NFTs are the right move product-wise. It might be better to
 *   mint a single NFT for the original update creator, and then mint seperate
 *   NFTs linking to the root NFT which contain some additional metadata (such
 *   as how much the supporter spent to support the founder). Should this be
 *   done as a collection? Or use the NFT module directly to do this?
 *
 * - Is it possible for supporters to purchase NFTs directly on our site with ETH?
 *   Don't want to create a new currency since this wouldn't have any inherit value
 *   and thus wouldn't support the founder financially for the update.
 *
 * - Is it possible to get the set of NFTs that we've minted for a user (whether it's
 *   a user's update or an NFT denoting that they supported someone else)? It would be good
 *   to expose an API for this so that people can showcase their NFTs publicly.
 */

// https://domain.com/blog/0xCa2041f7D9Cfb7750972449Cff8D9dca1505713b

// collection:
// - update 1
// - update 2
// - update 3

// want ppl to buy these:
// put on marketplace (supports ethereum or other token), either eth or weth, probably weth
// bad idea: supply 1 -> up supply to 2, list the second on marketplace, then sell that nft immedately to initator
// another idea: define supply when blog post created
// another idea: always have supply 1, have another collection of "supporter NFTs" which each reference original NFT
// another idea: buy the creators currency, stake it to support the founder, allocate tokens per update

// short term:
//

/**
 * The /api/mint endpoint allows a user to mint a new update as part of the collection.
 * By default, we mint the update with a supply of 1, and transfer the ownership of that
 * single update to the user as an NFT.
 */
export default (req: NextApiRequest, res: NextApiResponse) => {
  const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com")
    )
  );
  // omitted: create collection
  const module = sdk.getCollectionModule(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_MODULE_ADDRESS as string
  );
  // sdk.getAppModule();
  return new Promise<void>((resolve) => {
    const { account } = req.body;
    // module.createAndMint(); // gives to account automatically
  });
};
