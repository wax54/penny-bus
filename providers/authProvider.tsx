import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthApi } from "../api";
import {
  UserCreateParams,
  UserLoginParams,
  userPermissions,
} from "../types/user";
import { useLocalStorageState } from "../hooks";
import { UserData } from "../types";

type Loadable<DataType> =
  | {
      data?: DataType | undefined;
      loading: false;
      error?: string;
    }
  | {
      data?: DataType | undefined;
      loading: true;
      error?: string;
    }
  | {
      data: DataType;
      loading: false;
      error?: string;
    }
  | {
      data?: DataType;
      loading: false;
      error: string;
    };

const authContext = createContext<{
  userPermissions?: Loadable<userPermissions>;
  login?: (
    input: UserLoginParams
  ) => Promise<{ success: boolean; error?: string }>;
  signup?: (
    input: UserCreateParams
  ) => Promise<{ success: boolean; error?: string }>;
  logout?: () => Promise<void>;
}>({});

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [userPermissions, setUserPermissions] = useLocalStorageState<
    Loadable<userPermissions>
  >("userPermissions", { loading: false });
  // const [user, setUser] = useLocalStorageState<UserData>();
  // useEffect(() => {
  //   if (user) {
  //     setUserPermissions({
  //       loading: false,
  //       data: { loggedIn: true, user },
  //     });
  //   } else {
  //     setUserPermissions({
  //       loading: false,
  //       data: { loggedIn: false, user: undefined },
  //       error: undefined,
  //     });
  //   }
  // }, [user, setUserPermissions]);

  useEffect(() => {
    const attemptRefresh = async () => {
      const token = window.localStorage.getItem("auth");
      if (token) {
        const { success, user } = await AuthApi.get(token);
        if (success === false) {
          setUserPermissions({
            loading: false,
            data: { loggedIn: false, user: undefined },
          });
        } else {
          setUserPermissions({
            loading: false,
            data: { loggedIn: success, user },
          });
        }
      }
    };
    attemptRefresh();
  }, []);
  const login = useCallback(
    async (input: UserLoginParams) => {
      try {
        setUserPermissions({
          loading: true,
        });
        //call login api
        const data = await AuthApi.login(input);
        if (data.success === false) {
          throw Error(data.message);
        }
        // store token in local storage
        window.localStorage.setItem("auth", data.token);
        // get user data from endpoint
        const { user } = await AuthApi.get(data.token);
        // setUser(user);
        setUserPermissions({
          loading: false,
          data: { loggedIn: true, user },
        });
        return { success: true };
      } catch (e: any) {
        setUserPermissions({
          loading: false,
          error: e.message,
        });
        return { success: false, error: e.message };
      }
    },
    [setUserPermissions]
  );
  const signup = useCallback(
    async (input: UserCreateParams) => {
      try {
        //call login api
        const data = await AuthApi.create(input);
        // store token in local storage
        window.localStorage.setItem("auth", data.token);
        // get user data from endpoint
        const { user } = await AuthApi.get(data.token);
        // setUser(user);
        setUserPermissions({
          loading: false,
          data: { loggedIn: true, user },
        });
        return { success: true };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    },
    [setUserPermissions]
  );

  const logout = useCallback(async () => {
    // remove token from local storage
    window.localStorage.removeItem("auth");
    setUserPermissions({
      loading: false,
      data: { loggedIn: false, user: undefined },
      error: undefined,
    });
  }, [setUserPermissions]);
  return (
    <authContext.Provider value={{ userPermissions, login, signup, logout }}>
      <>{children}</>
    </authContext.Provider>
  );
};
export const usePermissions = () => {
  const data = useContext(authContext);
  return data.userPermissions;
};

export const useAuthTools = () => {
  const data = useContext(authContext);
  return data.login && data.signup
    ? { login: data.login, signup: data.signup, logout: data.logout }
    : {};
};
