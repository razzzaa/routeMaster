import { useCountries } from "../contexts/CountriesContext";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import SpinnerFullPage from "./SpinnerFullPage";
import Message from "./Message";

function CityList() {
  const { locations, isLoading } = useCountries();

  if (isLoading) return <SpinnerFullPage />;

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
