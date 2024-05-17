import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SpinnerFullPage from "./components/SpinnerFullPage";
import WrongPage from "./pages/WrongPage";
// import City from "./components/City";
import CountryList from "./components/CountryList";
import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import TokenTimer from "./components/TokenTimer";
import { CountriesProvider } from "./contexts/CountriesContext.jsx";

const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const Layout = lazy(() => import("./pages/Layout"));
const Pricing = lazy(() => import("./pages/Pricing"));

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <CountriesProvider>
          <TokenTimer />
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="about" element={<About />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="user/cities" />} />
                <Route path="user/cities" element={<CityList />} />
                <Route path="user/cities/city/:id" element={<City />} />
                <Route path="user/countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<WrongPage />} />
            </Routes>
          </Suspense>
        </CountriesProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
