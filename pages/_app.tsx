import { Themed, ThemeProvider } from "theme-ui";
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
        <Themed.root>
          <Component {...pageProps} />
        </Themed.root>
      </ThemeProvider>
    </DAppProvider>
  );
};

export default App;
