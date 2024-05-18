import { useCountries } from "../contexts/CountriesContext";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";

function CityList() {
  const { locations } = useCountries();

  if (!locations[0])
    return <Message message="Start by clicking somewhere on the map" />;

  return (
    <div className={styles.cityListContainer}>
      {locations.map((location) => (
        <>
          <CityItem loc={location} key={location.id} />
          {console.log(location)}
        </>
      ))}
    </div>
  );
}

export default CityList;
