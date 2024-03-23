type InputProps = JSX.IntrinsicElements["input"] &
  JSX.IntrinsicElements["select"] & {
    label: string;
    error?: string;
    inputType?: "input" | "select";
  };

export const Input = ({ error, inputType = "input", ...props }: InputProps) => {
  const id = props.id ?? props.name;
  return (
    <div className="my-3 flex flex-col items-start ">
      <label className="mb-1 text-textPrimary" htmlFor={id}>
        {props.label}
      </label>
      <InputComponent inputType={inputType} {...props} />
      <div>{error}</div>
    </div>
  );
};

const InputComponent = ({ inputType, id, ...props }: InputProps) => {
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
