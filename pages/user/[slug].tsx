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
type UserFormValues = UserCreateParams & UserLoginParams;

type GetTextReturnType = {
  title: string;
  username?: { label: string; placeholder: string };
  password?: { label: string; placeholder: string };
  name?: { label: string; placeholder: string };
  CTA: { text: string };
  secondaryCTA?: { text: string; href: string };
};
const getText = ({
  pageSlug,
}: {
  pageSlug: "login" | "create";
}): GetTextReturnType => {
  const defaultName = { label: "Name", placeholder: "Alex Decanter" };
  const defaultText = {
    title: "Welcome!",
    username: { label: "Username", placeholder: "SparkySilver" },
    password: {
      label: "Password",
      placeholder: "S upe80!!r Sec!r  et!P!a s981480!s",
    },
    CTA: { text: "Submit" },
  } as GetTextReturnType;

  if (pageSlug === "login") {
    return {
      ...defaultText,
      title: "Login here",
      secondaryCTA: {
        text: "New here?",
        href: authRedirects.getCreateRedirect(),
      },
    };
  } else if (pageSlug === "create") {
    return {
      ...defaultText,
      title: "Signup!",
      name: defaultName,
      secondaryCTA: {
        text: "Been here before?",
        href: authRedirects.getLoginRedirect(),
      },
    };
  } else {
    throw Error("NOT SET UP TO HANDLE PAGE :'" + pageSlug + "'");
  }
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
      <label className="mb-1 text-accent" htmlFor={id}>
        {label}
      </label>
      <input {...props} id={id} />
      <div> {error}</div>
    </div>
  );
};

export const Auth = ({
  pageSlug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { login, signup, logout } = useAuthTools();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
  });
  const pushMessage = usePushMessage();

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
                console.log(data);
                if (data.success) {
                  router.push("/admin/blog");
                } else {
                  console.log(data);
                  pushMessage({ message: data.error as string, type: "error" });
                }
              }
            )
            .catch((e) => {
              console.log(e);
              setLoading(false);
              pushMessage({ message: e.message, type: "error" });
            })
        : console.log("LOGIN/SIGNUP DOESN'T EXIST LET!");
    },
    [pageSlug, setLoading, router, login, signup]
  );

  if (pageSlug === "logout") {
    useEffect(() => {
      logout?.();
      router.push("/");
    }, [logout, router]);
    return null;
  }
  const { title, password, username, name, CTA, secondaryCTA } = getText({
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
          {username ? (
            <Input
              id="username"
              name="username"
              disabled={loading}
              className="rounded p-4 w-[500px] sm:w-[250px] "
              {...username}
              value={form.username}
              onChange={handleChange}
            />
          ) : null}
          {password ? (
            <Input
              type="password"
              name="password"
              className="p-4 rounded w-[500px] sm:w-[250px]"
              {...password}
              disabled={loading}
              value={form.password}
              onChange={handleChange}
            />
          ) : null}
          {name ? (
            <Input
              type="name"
              name="name"
              className=" p-4 rounded w-[500px] sm:w-[250px]"
              {...name}
              disabled={loading}
              value={form.name}
              onChange={handleChange}
            />
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 rounded-xl p-4 bg-primary hover:bg-secondary disabled:bg-accent/20  w-[500px] sm:w-[250px]"
            onClick={() => gainAccess(form)}
          >
            {CTA.text}
          </button>
          {secondaryCTA ? (
            <button
              className="text-center rounded-xl bg-accent my-7 p-4 hover:bg-secondary disabled:bg-accent/20 w-[500px] sm:w-[250px]"
              disabled={loading}
              onClick={() => {
                router.push(secondaryCTA.href);
              }}
            >
              {secondaryCTA.text}
            </button>
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
  if (["login", "create", "logout"].includes(params?.slug)) {
    return {
      props: { pageSlug: params.slug as "login" | "create" | "logout" },
    };
  } else {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
};
