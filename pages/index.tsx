import { Box, Text } from "theme-ui";
import Layout from "../components/layout";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

const Home = () => {
  const { account } = useEthers();
  const etherBalance = useEtherBalance(account);
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
            {account && <p>Account: {account}</p>}
            {etherBalance && <p>Balance: {formatEther(etherBalance)}</p>}
          </Text>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
