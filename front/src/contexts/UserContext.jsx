/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const UserContext = createContext();

const initialState = {
  isLoading: false,
  currentUser: {},
  isAuthenticated: false,
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "user/loggedIn":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case "user/registered":
      console.log(state);
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        currentUser: action.payload,
      };

    case "user/loggedOut":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        currentUser: {},
      };

    case "user/isAuthorized": {
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        currentUser: action.payload,
      };
    }

    case "rejected":
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function UserProvider({ children }) {
  const [{ isAuthenticated, isLoading, error, currentUser }, dispatch] =
    useReducer(reducer, initialState);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch(`${BASE_URL}/api/isLogged`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === true)
        dispatch({
          type: "user/isAuthorized",
          payload: {
            name: data.name,
            email: data.email,
            id: data.id,
          },
        });
    }

    checkAuth();
  }, []);

  async function registerUser(newUser) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === true) {
        console.log(data);

        dispatch({
          type: "user/registered",
          payload: { name: data.name, email: data.email, id: data.id },
        });
      } else {
        console.log(data.message);
      }
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error in the registretion process...",
      });
    } finally {
      navigate("/app");
    }
  }

  async function logIn(user) {
    console.log(user);
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      console.log(res.status);
      if (res.status === 401) {
        return dispatch({
          type: "rejected",
          payload:
            "Invalid username or password. Please check your credentials and try again...",
        });
      }
      if (res.status === 500) {
        return dispatch({
          type: "Internal Server Error",
          payload: "In",
        });
      }
      const data = await res.json();
      const { name, email, id } = data.userData;

      if (data.success === true) {
        navigate(`/app/user/cities`);
        return dispatch({
          type: "user/loggedIn",
          payload: { email, name, id },
        });
      }
    } catch (error) {
      console.log();
      dispatch({
        type: "rejected",
        payload: "Internal Server Error",
      });
    }
  }

  async function logOut() {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/api/logOut`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === true) {
        dispatch({ type: "user/loggedOut" });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "rejected", payload: error });
    }
  }

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        error,
        currentUser,
        registerUser,
        logOut,
        logIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error("THERE WAS AN ERROR FAM...");
  return context;
}

export { UserProvider, useUser };
