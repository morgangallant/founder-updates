/** @jsxImportSource theme-ui */
import { ThemeProvider } from "theme-ui";
import { AppProps } from "next/app";
import { DAppProvider, ChainId, Config } from "@usedapp/core";
import theme from "../styles";

const dappConfig: Config = {
  readOnlyChainId: ChainId.Mumbai,
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <DAppProvider config={dappConfig}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </DAppProvider>
  );
};

export default App;
