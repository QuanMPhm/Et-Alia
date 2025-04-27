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
      "max-w-[330px] cursor-pointer rounded-full text-center font-normal whitespace-nowrap transition-all active:translate-y-[2px]",
      variant === "black"
        ? "bg-black !text-white hover:bg-gray-800 active:bg-emerald-800"
        : "bg-white !text-black hover:bg-gray-100 active:bg-emerald-100",
      size === "large"
        ? "px-4 py-4 text-lg sm:px-6 sm:py-6 sm:text-xl"
        : "px-3 py-2",
      className || "",
    )}
    {...props}>
    {children}
  </a>
);

export const LinkButton = createLink(StyledLink);
