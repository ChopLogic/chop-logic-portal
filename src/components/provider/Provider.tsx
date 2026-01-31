"use client";

import { ThemeProvider } from "chop-logic-components";
import type { PropsWithChildren } from "react";

/* Wrapper provider to add any context providers needed app-wide */

export default function Provider({ children }: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
