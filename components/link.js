import NLink from "next/link";
import { Link as TLink } from "theme-ui";

// Checks if the link is facing outward.
const isExternal = (href) =>
  href.startsWith("http://") || href.startsWith("https://");

/**
 * Link component. Optimized links depending on whether it's an internal or external link.
 */
const Link = ({ href, ...props }) =>
  isExternal(href) ? (
    <TLink href={href} target="_blank" rel="noopener" {...props}>
      {props.children}
    </TLink>
  ) : (
    <NLink href={href}>
      <TLink {...props}>{props.children}</TLink>
    </NLink>
  );

export default Link;
