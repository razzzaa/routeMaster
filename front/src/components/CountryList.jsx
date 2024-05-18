import { useCountries } from "../contexts/CountriesContext";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";

function CountryList() {
  const { locations } = useCountries();
  console.log(locations);

  if (!locations[0])
    return <Message message="Start by clicking somewhere on the map" />;

  if (!locations.length) return <></>;

  const countries = locations.reduce((arr, curVal) => {
    if (!arr.map((e) => e.country).includes(curVal.country)) {
      return [...arr, { country: curVal.country, flagIso: curVal.countryIso }];
    } else return arr;
  }, []);
  console.log(countries);

  return (
    <div className={styles.countryListContainer}>
      {countries.map((location) => (
        <CountryItem location={location} key={location.id} />
      ))}
    </div>
  );
}

export default CountryList;
