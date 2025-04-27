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
        className="[&.active]:underline text-gray-500 hover:text-gray-700">
        Log In
      </LinkButton>
      <LinkButton
        to="/signup"
        size="normal"
        variant="black"
        className="[&.active]:underline text-gray-500 hover:text-gray-700">
        Sign Up
      </LinkButton>
    </>
  );
};

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="p-2 flex gap-2">
        <Container>
          <div className="col-start-10 col-span-3 flex flex-row gap-4 items-end justify-end lg:hidden">
            <LogInSignUp />
          </div>
          <Link
            to="/"
            className="col-span-12 sm:col-span-4 lg:col-span-3 flex items-end max-w-[250px]">
            <LogoWithText />
          </Link>
          <div className="col-start-6 col-span-7 lg:col-start-5 lg:col-span-3 flex flex-row gap-6 items-end justify-end lg:justify-between">
            <Link
              to="/about"
              className="[&.active]:underline text-gray-500 hover:text-gray-700 active:text-emerald-900 active:translate-y-[2px] transition-all">
              About
            </Link>
            <Link
              to="/faq"
              className="[&.active]:underline text-gray-500 hover:text-gray-700 active:text-emerald-900 active:translate-y-[2px] transition-all">
              FAQ
            </Link>
            <Link
              to="/contact"
              className="[&.active]:underline text-gray-500 hover:text-gray-700 active:text-emerald-900 active:translate-y-[2px] transition-all">
              Contact
            </Link>
          </div>
          <div className="col-start-10 col-span-3 flex-row gap-4 items-end justify-end hidden lg:flex">
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
