/* eslint-disable react/prop-types */
import Flag from "./Flag";
import styles from "./CityItem.module.css";
import { MdDeleteForever } from "react-icons/md";
import { useCountries } from "../contexts/CountriesContext";
import { Link } from "react-router-dom";
import SpinnerFullPage from "./SpinnerFullPage";

function CityItem({ loc }) {
  const { isLoading, deleteCity } = useCountries();

  const { lat, lng, id, city, country, countryIso } = loc;
  console.log(loc);
  const latNum = Number(lat);
  const lngNum = Number(lng);
  console.log(latNum);
  console.log(lngNum);

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  if (isLoading) return <SpinnerFullPage />;

  return (
    <Link
      className={styles.cityItem}
      to={`city/${id}?lat=${latNum}&lng=${lngNum}`}
    >
      <div className={styles.cityNameBox}>
        <h4>{city}</h4>
      </div>
      <div className={styles.cityItemFlagBox}>
        <Flag country={country} countryIso={countryIso} type="small" />
        <MdDeleteForever className={styles.deleteIcon} onClick={handleClick} />
      </div>
    </Link>
  );
}

export default CityItem;
