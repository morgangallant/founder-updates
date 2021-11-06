import * as React from "react";
import { useRouter } from "next/router";
import {
  Text,
  Heading,
  Spinner,
  Box,
  Textarea,
  Label,
  Input,
  Flex,
  Button,
} from "theme-ui";
import Layout from "../components/layout";
import { useEthers } from "@usedapp/core";
import { ThirdwebSDK, CollectionMetadata } from "@3rdweb/sdk";

/**
 * The page for displaying a blog owned by a user.
 * If the currently connected wallet owns the blog, the user can edit it.
 */
const Blog = () => {
  const router = useRouter();
  const { uri } = router.query;
  const { account, library } = useEthers();

  // Internal state.
  const [loading, setLoading] = React.useState(true);
  const [doesOwn, setDoesOwn] = React.useState<boolean | null>(null);
  const [posts, setPosts] = React.useState<CollectionMetadata[]>(null);
  const [blogTitle, setBlogTitle] = React.useState<string | null>(null);
  const [blogDescription, setBlogDescription] = React.useState<string | null>(
    null
  );

  // Form state.
  const [newPostTitle, setNewPostTitle] = React.useState<string | null>(null);
  const [newPostSubtitle, setNewPostSubtitle] = React.useState<string | null>(
    null
  );
  const [newPostContent, setNewPostContent] = React.useState<string | null>(
    null
  );

  // Checks if we're currently connected to a wallet.
  const connected = account && library;

  // Initialize the SDK.
  var sdk = new ThirdwebSDK("https://rpc-mumbai.maticvigil.com");

  // Whenever the account/library changes, update the sdk.
  // This ensures that we can always do transactions.
  React.useEffect(() => {
    if (connected) {
      sdk.setProviderOrSigner(library.getSigner());
    } else {
      sdk.setProviderOrSigner("https://rpc-mumbai.maticvigil.com");
    }
  }, [account, library]);

  // Get the collection address from the URI.
  const collectionAddress = Array.isArray(uri) ? uri[0] : uri;

  // Error message if the collection address is invalid.
  const invalidCollectionError =
    "Failed to retrieve blog contents. Double check the address?";

  // Prepare the view by loading the initial state.
  React.useEffect(() => {
    const prepare = async () => {
      setLoading(true);
      if (!collectionAddress) {
        setLoading(false);
        return;
      }
      if (!/^(0x)?[0-9a-fA-F]{40}$/.test(collectionAddress)) {
        setLoading(false);
        return;
      }
      const collectionModule = sdk.getCollectionModule(collectionAddress);
      const valid = await collectionModule.exists();
      if (!valid) {
        setLoading(false);
        return;
      }
      if (connected) {
        const nftModule = sdk.getNFTModule(
          process.env.NEXT_PUBLIC_BUILDR_ADDRESS
        );
        const owned = await nftModule.getAllWithOwner();
        setDoesOwn(
          owned
            .map((nft) => nft.metadata.properties["collection"] || "")
            .includes(collectionAddress)
        );
      } else {
        setDoesOwn(false);
      }
      const meta = await collectionModule.getMetadata();
      setBlogTitle(meta.metadata?.name || "");
      setBlogDescription(meta.metadata?.description || "");
      setPosts(await collectionModule.getAll());
      setLoading(false);
    };
    prepare();
  }, [connected, collectionAddress]);

  // If we're loading, show a spinner.
  if (loading) {
    return (
      <Layout>
        <Spinner size={22} />
      </Layout>
    );
  }

  // If there is an error, display it.
  if (!posts) {
    return (
      <Layout>
        <Text>{invalidCollectionError}</Text>
      </Layout>
    );
  }

  // Allows the user to create a blog post.
  const createBlogPost = async (
    title: string,
    subtitle: string,
    content: string
  ) => {
    if (!doesOwn || title == "" || subtitle == "" || content == "") {
      return;
    }
    const collectionModule = new ThirdwebSDK(
      library.getSigner()
    ).getCollectionModule(collectionAddress);
    const minted = await collectionModule.createAndMint({
      metadata: {
        name: title,
        description: subtitle,
        image: "ipfs://QmQ8D7Cgmojpmkp7jGh8yFLjtAbyJ2YmWPHDDxrsQdAaqC",
        properties: {
          content: content,
          timestamp: new Date().toISOString(),
        },
      },
      supply: 1,
    });
    console.log("minted blog post", minted);
  };

  // Renders the text content of a blog post.
  const renderPostContent = (content: string) => (
    <Box sx={{ whiteSpace: "pre-wrap" }}>{content}</Box>
  );

  console.log(doesOwn);
  console.log(posts);

  return (
    <Layout>
      <Heading>{blogTitle}</Heading>
      <Text sx={{ mb: 3, display: "block" }}>{blogDescription}</Text>
      {doesOwn && (
        <>
          <Heading sx={{ fontSize: 3 }}>Create New Post</Heading>
          <Box
            as="form"
            sx={{ p: 3 }}
            onSubmit={(e) => {
              e.preventDefault();
              createBlogPost(newPostTitle, newPostSubtitle, newPostContent);
              setNewPostTitle("");
              setNewPostSubtitle("");
              setNewPostContent("");
            }}
          >
            <Box>
              <Label htmlFor="title">title</Label>
              <Input
                name="title"
                mb={3}
                type="text"
                placeholder="Title"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
              <Label htmlFor="title">subtitle</Label>
              <Input
                name="subtitle"
                mb={3}
                type="text"
                placeholder="Subtitle"
                value={newPostSubtitle}
                onChange={(e) => setNewPostSubtitle(e.target.value)}
              />
              <Textarea
                name="content"
                placeholder="Post Content"
                mb={3}
                rows={8}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
            </Box>
            <Flex sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Button sx={{ mr: 2 }}>Create Post</Button>
            </Flex>
          </Box>
        </>
      )}
      {posts.length == 0 ? (
        <Text>No posts yet.</Text>
      ) : (
        <>
          {posts.map((post, i) => (
            <Box key={i} sx={{ padding: 3, mt: 4 }}>
              <Heading sx={{ fontSize: 3 }}>{post.metadata.name}</Heading>
              <Text sx={{ fontSize: 2, display: "block", mb: 2 }}>
                {new Date(
                  Date.parse(post.metadata.properties["timestamp"].toString())
                ).toLocaleString()}{" "}
                - {post.metadata.description}
              </Text>
              {renderPostContent(
                post.metadata.properties["content"].toString()
              )}
            </Box>
          ))}
        </>
      )}
    </Layout>
  );
};

export default Blog;
