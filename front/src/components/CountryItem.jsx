/* eslint-disable react/prop-types */
import Flag from "./Flag";
import styles from "./CountryItem.module.css";
import SpinnerFullPage from "./SpinnerFullPage";
import { useCountries } from "../contexts/CountriesContext";

function CountryItem({ location }) {
  const { isLoading } = useCountries();

  if (isLoading) return <SpinnerFullPage />;

  return (
    <div>
      <div className={styles.countryItemContainer}>
        <p>{location.country}</p>
        <Flag
          countryIso={location.flagIso}
          country={location.country}
          type="small"
        />
      </div>
    </div>
  );
}

export default CountryItem;
