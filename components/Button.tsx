import { Renderable } from "../types/react";

export const Button = ({
  children,
  btnType,
  ...props
}: JSX.IntrinsicElements["button"] & {
  btnType: "primary" | "secondary" | "nav";
  children: Renderable;
}) => {
  let className = props.className || "";
  if (btnType === "primary") {
    className +=
      " mt-7 rounded-xl p-4 w-[250px] md:w-[500px] text-textPrimary bg-primary hover:bg-accent disabled:bg-disabled ";
  } else if (btnType === "secondary") {
    className +=
      " mt-7 rounded-xl p-4 w-[250px] md:w-[500px] text-textSecondary bg-secondary hover:bg-accent disabled:bg-disabled ";
  } else if (btnType === "nav") {
    className +=
      "text-textPrimary hover:outline-textPrimary m-1 py-2 px-5 rounded-[10px] duration-150  outline-none";
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
