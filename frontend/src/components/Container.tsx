export const Container = ({
  children,
  noPadding,
  className,
}: {
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={[
        "grid h-full w-full grid-cols-12 gap-4",
        noPadding ? "" : "p-6",
        className,
      ].join(" ")}>
      {children}
    </div>
  );
};
