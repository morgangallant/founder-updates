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
import { useEthers } from "@usedapp/core";
import { ThirdwebSDK, NFTMetadata } from "@3rdweb/sdk";

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

  // Checks if we are able to mint / perform operations.
  const ready = account && library;

  // Get all the blogs that this user owns.
  React.useEffect(() => {
    const getter = async () => {
      if (!ready) {
        return;
      }
      const sdk = new ThirdwebSDK(library.getSigner());
      const module = sdk.getNFTModule(process.env.NEXT_PUBLIC_BUILDR_ADDRESS);
      let all = await module.getAllWithOwner();
      setOwned(all.map((x) => x.metadata));
    };
    getter();
  }, [account, library]);

  // Mint a new blog for the active user.
  const mintBlog = async (name: string, description: string) => {
    if (!ready) {
      return;
    }
    const sdk = new ThirdwebSDK(library.getSigner());
    // TODO: Create the collection which stores all the posts for this collection.
    // Same name, description is `Originally created by ${address}.`.
    const module = sdk.getNFTModule(process.env.NEXT_PUBLIC_BUILDR_ADDRESS);
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
                you&apos;ve connected your wallet, you can create your first
                blog, and we&apos;ll send you an NFT to celebrate! This NFT
                verifies that you&apos;re the true, rightful owner of your blog.
                Each post you make within a blog is minted as its own NFT, and
                can be optionally auctioned off to supporters who wish to
                support your journey.
              </Text>
            </Box>
          )}
        </Section>
      </Box>
    </Layout>
  );
};

export default Root;
