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
        "grid grid-cols-12 gap-4 h-full w-full",
        noPadding ? "" : "p-6",
        className,
      ].join(" ")}>
      {children}
    </div>
  );
};
