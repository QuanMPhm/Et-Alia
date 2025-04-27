import clsx from "clsx";
import { Container } from "./Container";

export const ColorBlock = ({
  children,
  noPadding,
  color = "blue",
  className,
}: {
  children: React.ReactNode;
  noPadding?: boolean;
  color?: string;
  className?: string;
}) => {
  console.log(color);
  return (
    <div className={clsx("rounded-3xl", className)}>
      <Container noPadding={noPadding}>{children}</Container>
    </div>
  );
};
