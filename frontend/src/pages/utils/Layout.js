import { Content } from "./Content.js"
import { Box } from "./Box.js";

export const Layout = ({ children }) => (
  <Box
    css={{
      maxW: "100%"
    }}
  >
    {children}
    <Content />
  </Box>
);
