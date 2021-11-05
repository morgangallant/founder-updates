import * as React from "react";
import NLink from "next/link";
import { Link as TLink } from "theme-ui";
import { SystemStyleObject } from "@styled-system/css";

export interface Props {
  to?: string;
  href?: string;
  target?: string;
  variant?: string;
  className?: string;
  sx?: SystemStyleObject;
}

const isExternal = (ref: string): boolean =>
  ref.startsWith("http://") || ref.startsWith("https://");

const Link: React.FC<Props> = (props) => {
  const ref = props.href || props.to;
  if (isExternal(ref)) {
    return (
      <TLink href={ref} target="_blank" rel="noopener" {...props}>
        {props.children}
      </TLink>
    );
  }
  return (
    <NLink href={ref}>
      <TLink {...props}>{props.children}</TLink>
    </NLink>
  );
};

export default Link;
