import { Box, Grid, Text, Themed } from "theme-ui";
import Layout from "../components/layout";
import Link from "../components/link";

/**
 * Homepage
 */
const Index = () => {
  return (
    <Layout>
      <Box>
        <Box sx={{ py: 5, textAlign: "center" }}>
          <Text
            sx={{
              fontSize: 3,
              maxWidth: "32rem",
              mt: 0,
              mb: 4,
              mx: "auto",
            }}
          >
            Under construction.
          </Text>
        </Box>
      </Box>
    </Layout>
  );
};

export default Index;
