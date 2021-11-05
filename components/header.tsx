import * as React from "react";
import { Button, Box, Flex, NavLink, useColorMode, Image } from "theme-ui";
import Link from "./link";
import { Moon, Sun } from "react-feather";
import { useEthers } from "@usedapp/core";

const ThemeSwitcher: React.FC = () => {
  const [colorMode, setColorMode] = useColorMode();
  const size = 18;
  return (
    <Button
      aria-label="theme switcher"
      onClick={() => setColorMode(colorMode === "default" ? "dark" : "default")}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "text",
        bg: "transparent",
        border: "none",
        px: 2,
        py: 1,

        "&:hover,&:focus,&:active": {
          color: "text",
          bg: "accent",
          boxShadow: "none",
        },
      }}
    >
      {colorMode === "default" ? <Moon size={size} /> : <Sun size={size} />}
    </Button>
  );
};

const Nav: React.FC = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  return (
    <Flex as="nav">
      {account ? (
        <>
          <NavLink onClick={() => deactivate()}>disconnect wallet</NavLink>
        </>
      ) : (
        <>
          <NavLink onClick={() => activateBrowserWallet()}>
            connect wallet
          </NavLink>
        </>
      )}
      <ThemeSwitcher />
    </Flex>
  );
};

const Header: React.FC<{ home?: string }> = (props) => (
  <Flex
    sx={{
      py: [2, 3],
      justifyContent: "flex-end",
    }}
  >
    <Nav />
  </Flex>
);

export default Header;
