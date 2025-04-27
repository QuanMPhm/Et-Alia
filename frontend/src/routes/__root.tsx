import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// @ts-expect-error: Cannot find module
import LogoWithText from "../assets/EtAliaLogoWithText.svg?react";
import { Container } from "../components/Container";
import { LinkButton } from "../components/LinkButton";

const LogInSignUp = () => {
  return (
    <>
      <LinkButton
        to="/login"
        size="normal"
        variant="white"
        className="text-gray-500 hover:text-gray-700 [&.active]:underline">
        Log In
      </LinkButton>
      <LinkButton
        to="/signup"
        size="normal"
        variant="black"
        className="text-gray-500 hover:text-gray-700 [&.active]:underline">
        Sign Up
      </LinkButton>
    </>
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="flex gap-2 p-2">
        <Container>
          <div className="col-span-3 col-start-10 flex flex-row items-end justify-end gap-4 lg:hidden">
            <LogInSignUp />
          </div>
          <Link
            to="/"
            className="col-span-12 flex max-w-[250px] items-end sm:col-span-4 lg:col-span-3">
            <LogoWithText />
          </Link>
          <div className="col-span-7 col-start-6 flex flex-row items-end justify-end gap-6 lg:col-span-3 lg:col-start-5 lg:justify-between">
            <Link
              to="/about"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              About
            </Link>
            <Link
              to="/faq"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              FAQ
            </Link>
            <Link
              to="/contact"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              Contact
            </Link>
          </div>
          <div className="col-span-3 col-start-10 hidden flex-row items-end justify-end gap-4 lg:flex">
            <LogInSignUp />
          </div>
        </Container>
      </header>

      <main className="h-full w-full">
        <Outlet />
      </main>

      <footer>Copyright 2025</footer>

      <TanStackRouterDevtools />
    </>
  ),
});
// <Link
//   to="/docs"
//   search={{ q: "doc1" }}
//   className="[&.active]:font-bold">
//   Docs search
// </Link>
