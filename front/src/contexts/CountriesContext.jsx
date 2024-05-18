import {
  useContext,
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { useUser } from "./UserContext";

const BASE_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const CountriesContext = createContext();

const initialState = {
  locations: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "data/loaded":
      return { ...state, isLoading: false, locations: action.payload };

    case "rejected":
      console.log("error");
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "city/loaded":
      console.log("City loaded with payload:", action.payload);

      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        locations: state.locations.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        locations: [...state.locations, action.payload],
        currentCity: action.payload,
      };
    default:
      throw new Error("unknown action type");
  }
}

// eslint-disable-next-line react/prop-types
function CountriesProvider({ children }) {
  const [{ locations, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const { currentUser, isAuthenticated } = useUser();
  //   useEffect(() => {
  //     async function getData() {
  //       dispatch({ type: "loading" });
  //       try {
  //         const data = await fetch(`${BASE_URL}/api/data`);
  //         const res = await data.json();

  //         const firstToUpper = res.map((location) => ({
  //           ...location,
  //           city: location.city.at(0).toUpperCase() + location.city.slice(1),
  //           country:
  //             location.country.at(0).toUpperCase() + location.country.slice(1),
  //         }));
  //         dispatch({
  //           type: "data/loaded",
  //           payload: firstToUpper,
  //         });
  //       } catch {
  //         dispatch({
  //           type: "rejected",
  //           payload: "There was an error loading cities...",
  //         });
  //       }
  //     }
  //     getData();
  //   }, []);

  useEffect(() => {
    dispatch({ type: "loading" });
    async function getUserData() {
      console.log("auth");
      try {
        const res = await fetch(
          `${BASE_URL}/api/userLocations/${currentUser.id}`
        );
        const data = await res.json();
        console.log(data);

        const firstToUpper = data.locations.map((location) => ({
          ...location,
          city: location.city.at(0).toUpperCase() + location.city.slice(1),
          country:
            location.country.at(0).toUpperCase() + location.country.slice(1),
        }));
        console.log("before dispatch");
        dispatch({
          type: "data/loaded",
          payload: firstToUpper,
        });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    getUserData();
  }, [isAuthenticated, currentUser.id]);

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/api/deleteCity/${id}`, { method: "DELETE" });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "cannot delete city" });
    }
  }

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/api/cities/${id}`);
        const data = await res.json();
        console.log(data.locations.at(0));
        const locations = data.locations.at(0);
        const firstToCaps = {
          ...locations,
          city: locations.city.at(0).toUpperCase() + locations.city.slice(1),
          country:
            locations.country.at(0).toUpperCase() + locations.country.slice(1),
        };
        dispatch({ type: "city/loaded", payload: firstToCaps });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/api/addCity`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      dispatch({ type: "city/created", payload: newCity });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  return (
    <CountriesContext.Provider
      value={{
        locations,
        isLoading,
        currentCity,
        error,
        deleteCity,
        getCity,
        createCity,
      }}
    >
      {children}
    </CountriesContext.Provider>
  );
}

function useCountries() {
  const context = useContext(CountriesContext);
  if (context === undefined) throw new Error(" used outside the Provider");
  return context;
}

export { CountriesProvider, useCountries };
