import * as React from "react";
import { useRouter } from "next/router";
import { Text, Heading } from "theme-ui";
import Layout from "../components/layout";

const Blog = () => {
  const router = useRouter();
  const { uri } = router.query;

  return (
    <Layout>
      <Heading>Blog: {uri}</Heading>
    </Layout>
  );
};

export default Blog;
