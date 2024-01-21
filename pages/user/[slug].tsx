import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { styles } from "../../constants/styles";
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { UserCreateParams, UserLoginParams } from "../../types/user";
import { useRouter } from "next/router";
import { authRedirects } from "../../utils/auth";
import { usePushMessage } from "../../providers";
import { useAuthTools, usePermissions } from "../../providers/authProvider";
import { Button } from "../../components/Button";
type UserFormValues = UserCreateParams & UserLoginParams;

type FormType = {
  username: string;
  password: string;
  "confirm-password": string;
  name: string;
};

type InputType<Form> = {
  id: string;
  name: keyof Form;
  type?: "password" | "text"; // defaults to text
  label: string;
  placeholder: string;
  autoComplete: string;
  required?: true;
};

const Input = ({
  label,
  error,
  ...props
}: JSX.IntrinsicElements["input"] & {
  label: string;
  error?: string;
}) => {
  const id = props.id ?? props.name;
  return (
    <div className="my-3 flex flex-col items-start ">
      <label className="mb-1 text-textPrimary" htmlFor={id}>
        {label}
      </label>
      <input
        className=" p-4 rounded w-[250px] md:w-[500px]"
        {...props}
        id={id}
      />
      <div> {error}</div>
    </div>
  );
};

type GetTextReturnType = {
  title: string;
  inputs: InputType<FormType>[];
  CTA: { text: string };
  secondaryCTA?: { text: string; href: string };
};
const getText = ({
  pageSlug,
}: {
  pageSlug: "create" | "login";
}): GetTextReturnType => {
  const name = {
    id: "name",
    label: "Name",
    name: "name",
    placeholder: "Alex Decanter",
    autoComplete: "name",
    required: true,
  } as const;
  const username = {
    id: "username",
    label: "Username",
    name: "username",
    placeholder: "SparkySilver",
    autoComplete: "username",
  } as const;
  const password = {
    id: "password",
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "S upe80!!r Sec!r  et!P!a s981480!s",
    autoComplete: "current-password",
  } as const;
  const CTA = { text: "Submit" };

  if (pageSlug === "login") {
    return {
      title: "Login here",
      inputs: [username, password],
      CTA,
      secondaryCTA: {
        text: "New here?",
        href: authRedirects.getCreateRedirect(),
      },
    };
  } else if (pageSlug === "create") {
    return {
      title: "Signup!",
      inputs: [
        username,
        { ...password, autoComplete: "new-password" },
        {
          ...password,
          autoComplete: "new-password",
          name: "confirm-password",
          label: "Confirm password",
        },
        name,
      ],
      CTA,
      secondaryCTA: {
        text: "Been here before?",
        href: authRedirects.getLoginRedirect(),
      },
    };
  } else {
    throw Error("NOT SET UP TO HANDLE PAGE :'" + pageSlug + "'");
  }
};

export const Auth = ({
  pageSlug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { login, signup } = useAuthTools();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormType>({
    username: "",
    password: "",
    "confirm-password": "",
    name: "",
  });
  const pushMessage = usePushMessage();
  const validate = (form: FormType) => {
    if (pageSlug === "login") {
      return form.username && form.password;
    } else if (pageSlug === "create") {
      return (
        form["confirm-password"] && form.name && form.password && form.username
      );
    } else {
      throw Error('unknown page slug "' + pageSlug + '"');
    }
  };
  const gainAccess = useCallback(
    (user: UserFormValues) => {
      //TODO Validation
      setLoading(true);
      const manipulation = pageSlug === "login" ? login : signup;
      manipulation
        ? manipulation({ ...user })
            .then(
              (
                data: { success: true } | { success: false; error?: string }
              ) => {
                setLoading(false);
                if (data.success) {
                  router.push("/admin/blog");
                } else {
                  pushMessage({ message: data.error as string, type: "error" });
                }
              }
            )
            .catch((e) => {
              console.log(e);
              setLoading(false);
              pushMessage({ message: e.message, type: "error" });
            })
        : console.log("LOGIN/SIGNUP DOESN'T EXIST YET!");
    },
    [pageSlug, setLoading, router, login, signup]
  );
  if (!pageSlug) {
    return <div> LOADING...</div>;
  }
  const { title, inputs, CTA, secondaryCTA } = getText({
    pageSlug,
  });
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = evt.target;
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  };
  return (
    <Layout style={styles}>
      <div>
        <form className="flex flex-col items-center">
          <h1>{title}</h1>

          {inputs.map((inputDetails) => (
            <Input
              key={inputDetails.id}
              {...inputDetails}
              disabled={loading}
              value={form[inputDetails.name]}
              onChange={handleChange}
            />
          ))}
          <Button
            type="submit"
            disabled={loading}
            btnType="primary"
            onClick={() => validate(form) && gainAccess(form)}
          >
            {CTA.text}
          </Button>
          {secondaryCTA ? (
            <Button
              disabled={loading}
              btnType="secondary"
              onClick={() => {
                router.push(secondaryCTA.href);
              }}
            >
              {secondaryCTA.text}
            </Button>
          ) : null}
        </form>
      </div>
    </Layout>
  );
};
export default Auth;
export const getStaticPaths = (): GetStaticPathsResult => {
  return {
    paths: [{ params: { slug: "login" } }, { params: { slug: "create" } }],
    fallback: "blocking",
  };
};
export const getStaticProps = ({
  params,
}: GetStaticPropsContext<{ slug: string }>) => {
  if (!params) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  if (["login", "create"].includes(params?.slug)) {
    return {
      props: { pageSlug: params.slug as "login" | "create" },
    };
  } else {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
};
