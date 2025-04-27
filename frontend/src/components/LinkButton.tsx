import clsx from "clsx";
import { createLink } from "@tanstack/react-router";

const StyledLink = ({
  variant = "black",
  size = "large",
  children,
  className,
  ...props
}: {
  size?: "large" | "normal";
  variant?: "black" | "white";
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    className={clsx(
      "whitespace-nowrap cursor-pointer rounded-full text-center max-w-[330px] active:translate-y-[2px] transition-all font-normal",
      variant === "black"
        ? "bg-black !text-white hover:bg-gray-800 active:bg-emerald-800"
        : "bg-white !text-black hover:bg-gray-100 active:bg-emerald-100",
      size === "large"
        ? "text-lg sm:text-xl px-4 sm:px-6 py-4 sm:py-6 "
        : "px-3 py-2",
      className || "",
    )}
    {...props}>
    {children}
  </a>
);

export const LinkButton = createLink(StyledLink);
