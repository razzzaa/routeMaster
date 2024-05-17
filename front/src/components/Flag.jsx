import styles from "./Flag.module.css";

/* eslint-disable react/prop-types */
function Flag({ countryIso, country, type }) {
  return (
    <img
      className={`${styles.flag} ${styles[type]}`}
      alt={country}
      src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryIso}.svg`}
    />
  );
}
export default Flag;
