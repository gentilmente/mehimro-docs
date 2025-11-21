import React from "react";
import { Redirect } from "@docusaurus/router";
import type { JSX } from "react";

export default function Home(): JSX.Element {
  return <Redirect to='/docs/intro' />;
}
