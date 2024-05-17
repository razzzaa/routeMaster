import { createContext, useContext, useReducer } from "react";

const initialState = {
  isOpen: false,
};

const HamburgerContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "open":
      return {
        ...state,
        isOpen: true,
      };
    case "close":
      return {
        ...state,
        isOpen: false,
      };
    default:
      throw new Error("Action unknown");
  }
}

// eslint-disable-next-line react/prop-types
function HmburgerProvider({ children }) {
  const [{ isOpen }, dispatch] = useReducer(reducer, initialState);
  console.log(isOpen);

  return (
    <HamburgerContext.Provider value={{ isOpen, dispatch }}>
      {children}
    </HamburgerContext.Provider>
  );
}

function useBurger() {
  const context = useContext(HamburgerContext);
  if (context === undefined) throw new Error(" used outside the Provider");
  return context;
}

export { HmburgerProvider, useBurger };
