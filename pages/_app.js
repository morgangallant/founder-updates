import { Themed, ThemeProvider } from "theme-ui";
import theme from "../styles";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Themed.root>
        <Component {...pageProps} />;
      </Themed.root>
    </ThemeProvider>
  );
}

export default MyApp;
