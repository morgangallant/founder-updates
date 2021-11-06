import * as React from "react";
import {
  Box,
  Text,
  Heading,
  Grid,
  Label,
  Input,
  Flex,
  Button,
  Card,
} from "theme-ui";
import Layout from "../components/layout";
import Link from "../components/link";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { ThirdwebSDK, CollectionMetadata, NFTMetadata } from "@3rdweb/sdk";

const Home = () => {
  const { account, library } = useEthers();
  const etherBalance = useEtherBalance(account);
  const [minted, setMinted] = React.useState<CollectionMetadata[]>([]);

  React.useEffect(() => {
    const getter = async () => {
      if (!library) {
        return;
      }
      const sdk = new ThirdwebSDK(library.getSigner());
      const module = sdk.getCollectionModule(
        process.env.NEXT_PUBLIC_NFT_COLLECTION_MODULE_ADDRESS as string
      );
      setMinted((await module.getAll()) as CollectionMetadata[]);
      console.log(minted);
    };
    getter();
  }, [library]);

  const mint = async () => {
    await fetch("/api/mint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account }),
    });
    console.log("Minted, refresh the page.");
  };

  return (
    <Layout>
      <Box>
        {account ? (
          <Box sx={{ py: 5 }}>
            <Text
              sx={{
                fontSize: 3,
                maxWidth: "32rem",
                mt: 0,
                mb: 4,
                mx: "auto",
              }}
            >
              {account && <p>Account: {account}</p>}
              {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
            </Text>
            <Text>So far, the following NFT collections have been minted:</Text>
            <ul>
              {minted.map((minted, i) => (
                <li key={i}>
                  <p>
                    {minted.metadata.name} ({minted.metadata.description})
                  </p>
                  <p>Content: '{minted.metadata.properties["raw"]}'</p>
                </li>
              ))}
            </ul>
          </Box>
        ) : (
          <Text>Please connect your wallet to get started.</Text>
        )}
      </Box>
    </Layout>
  );
};

const Index = () => {
  return (
    <Layout>
      <Box>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Heading sx={{ mb: 3 }}>The future is finally here.</Heading>

          <Text
            sx={{
              fontSize: 3,
              maxWidth: "32rem",
              mt: 0,
              mb: 4,
              mx: "auto",
            }}
          >
            Operand is a next-generation personal virtual assistant straight out
            of science fiction. We believe that everyone should have a proactive
            digital assistant working on their behalf 24/7.
          </Text>

          <Box>
            <Link
              href="https://operand.ai"
              variant="button"
              sx={{ width: "auto", py: 2, mt: 4 }}
            >
              Get Beta Access
            </Link>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

/**
 * A section on the website.
 */
const Section: React.FC = (props) => (
  <Box sx={{ py: [4] }} {...props}>
    {props.children}
  </Box>
);

/**
 * The root component of the homepage.
 * This component contains some basic description of the application,
 * in addition to a prompt to connect your wallet. Once the user has
 * connected their wallet, we will show the user their posts, and allow
 * them to create a new post.
 */
const Root: React.FC = () => {
  const { account, library } = useEthers();
  const [owned, setOwned] = React.useState<NFTMetadata[]>([]);

  // State for the form.
  const [blogName, setBlogName] = React.useState("");
  const [blogDescription, setBlogDescription] = React.useState("");

  // Get the address of the buildr NFT contract.
  const buildrAddress = process.env.NEXT_PUBLIC_BUILDR_ADDRESS;

  // Checks if we are able to mint / perform operations.
  const ready = account && library && buildrAddress;

  // Get all the blogs that this user owns.
  React.useEffect(() => {
    const getter = async () => {
      if (!ready) {
        return;
      }
      const sdk = new ThirdwebSDK(library.getSigner());
      const module = sdk.getNFTModule(buildrAddress);
      let all = await module.getAllWithOwner();
      setOwned(all.map((x) => x.metadata));
    };
    getter();
  }, [account, library, buildrAddress]);

  // Mint a new blog for the active user.
  const mintBlog = async (name: string, description: string) => {
    if (!ready) {
      return;
    }
    const sdk = new ThirdwebSDK(library.getSigner());
    // TODO: Create the collection which stores all the posts for this collection.
    // Same name, description is `Originally created by ${address}.`.
    const module = sdk.getNFTModule(buildrAddress);
    let meta = await module.mint({
      name: name,
      description: description,
      image: "ipfs://QmQ8D7Cgmojpmkp7jGh8yFLjtAbyJ2YmWPHDDxrsQdAaqC",
      properties: {
        collection: "0x04A2a7e16F890031D25527774958281b7190e24F", // TODO: Change to address of collection.
      },
    });
  };

  console.log(owned);

  return (
    <Layout>
      <Box>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Heading sx={{ mb: 3 }}>
            Get paid to share your story with the world.
          </Heading>
          <Text
            sx={{
              fontSize: 3,
              maxWidth: "28rem",
              mx: "auto",
              display: "inline-block",
            }}
          >
            Buildr gives you the tools to share your one-of-a-kind journey with
            the world, and gives others the ability to support that journey.
          </Text>
        </Box>
        <Section>
          {ready ? (
            <Box>
              <Heading sx={{ fontSize: 3, mb: 3 }}>Your Blogs</Heading>
              <Grid gap={3} columns={[null, 3]}>
                {owned.map((blog, i) => (
                  <Box key={i}>
                    <Link href={`/${blog.properties["collection"]}`}>
                      <Card
                        sx={{
                          p: 3,
                          border: "1px solid black",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          sx={{
                            fontSize: 3,
                            display: "inline-block",
                            fontWeight: "bold",
                          }}
                        >
                          {blog.name}
                        </Text>
                        <Text sx={{ fontSize: 2, display: "inline-block" }}>
                          {blog.description}
                        </Text>
                      </Card>
                    </Link>
                  </Box>
                ))}
              </Grid>
              <Box
                as="form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  let name = blogName;
                  let description = blogDescription;
                  if (name == "" || description == "") {
                    console.warn("invalid name or description");
                    return;
                  }
                  await mintBlog(name, description);
                  setBlogName("");
                  setBlogDescription("");
                }}
              >
                <Box>
                  <Label htmlFor="name">name</Label>
                  <Input
                    name="name"
                    mb={3}
                    type="text"
                    placeholder="Investor Updates"
                    value={blogName}
                    onChange={(e) => setBlogName(e.target.value)}
                  />
                  <Label htmlFor="description">description</Label>
                  <Input
                    name="name"
                    mb={3}
                    type="text"
                    placeholder="Here are my cool investor updates."
                    value={blogDescription}
                    onChange={(e) => setBlogDescription(e.target.value)}
                  />
                </Box>
                <Flex sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Button sx={{ mr: 2 }}>Create Blog</Button>
                </Flex>
              </Box>
            </Box>
          ) : (
            <Box>
              <Heading sx={{ fontSize: 3 }}>How does it work?</Heading>
              <Text sx={{ fontSize: 3, py: 3, display: "inline-block" }}>
                Get started by connecting your wallet (top right hand corner of
                the page), which will be used to store all of your writing. Once
                you've connected your wallet, you can create your first blog,
                and we'll send you an NFT to celebrate! This NFT verifies that
                you're the true, rightful owner of your blog. Each post you make
                within a blog is minted as its own NFT, and can be optionally
                auctioned off to supporters who wish to support your journey.
              </Text>
            </Box>
          )}
        </Section>
      </Box>
    </Layout>
  );
};

export default Root;
