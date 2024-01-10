import { Renderable } from "../types/react";

export const Button = ({
  children,
  btnType,
  ...props
}: JSX.IntrinsicElements["button"] & {
  btnType: "primary" | "secondary";
  children: Renderable;
}) => {
  let className = " mt-7 rounded-xl p-4 w-[250px] md:w-[500px] ";
  if (btnType === "primary") {
    className += " bg-primary hover:bg-accent disabled:bg-disabled ";
  } else if (btnType === "secondary") {
    className += " bg-secondary hover:bg-accent disabled:bg-disabled ";
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
