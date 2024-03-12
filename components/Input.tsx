export const Input = ({
  label,
  error,
  inputType = "input",
  ...props
}: JSX.IntrinsicElements["input"] &  JSX.IntrinsicElements["select"] &  {
  label: string;
  error?: string;
  inputType?: "input" | "select";
}) => {
  const id = props.id ?? props.name;
  const InputComponent = () => {
    switch (inputType) {
      case "select":
        return (
          <select
            className=" p-4 rounded w-[250px] md:w-[500px]"
            {...props}
            id={id}
          />
        );
      case "input":
      default:
        return (
          <input
            className=" p-4 rounded w-[250px] md:w-[500px]"
            {...props}
            id={id}
          />
        );
    }
  };
  return (
    <div className="my-3 flex flex-col items-start ">
      <label className="mb-1 text-textPrimary" htmlFor={id}>
        {label}
      </label>
      <InputComponent />
      <div>{error}</div>
    </div>
  );
};
