import * as React from "react";
import { Box } from "theme-ui";
import Head from "next/head";
import Header from "./header";

export interface Props {
  title?: string;
  description?: string;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Head>
      <Box
        sx={{
          maxWidth: "container",
          mx: "auto",
          my: 0,
          px: [3, 4],
          py: 0,
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
          }}
        >
          <Header />
          {props.children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
