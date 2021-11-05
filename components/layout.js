import { Box } from "theme-ui";

// layout takes children, an optional title and optional description
const Layout = ({ children, title, description }) => {
  return (
    <>
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
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
