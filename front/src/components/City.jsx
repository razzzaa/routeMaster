import { useEffect } from "react";
import { useCountries } from "../contexts/CountriesContext";
import styles from "./City.module.css";
import { useParams } from "react-router-dom";
import Flag from "./Flag";
import BackButton from "./BackButton";
import SpinnerFullPage from "./SpinnerFullPage";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCountries();

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  const { city, date, notes, countryIso, country } = currentCity;
  console.log(countryIso);
  console.log(city);

  if (isLoading) return <SpinnerFullPage />;

  return (
    <div className={styles.cityContainer}>
      <header className={styles.header}>
        <div className={styles.cityHeader}>
          <h5>City name:</h5>
          <h3>{city}</h3>
          <div className={styles.flag}>
            <Flag countryIso={countryIso} country={country} type={"big"} />
          </div>
        </div>
      </header>

      <main className={styles.mainBox}>
        <div className={styles.date}>
          <h5>
            Youve visited {city} on: {formatDate(date || null)}
          </h5>
        </div>

        <div className={styles.notes}>
          <h5>Your notes:</h5>
          <p>{notes}</p>
        </div>

        <article className={styles.wiki}>
          <h5>Learn more:</h5>
          <a
            href={`https://en.wikipedia.org/wiki/${city}`}
            rel="noreferrer"
            target="_blank"
          >
            Read about {city} on wikipedia
          </a>
        </article>
        <div className={styles.returnBtn}>
          <BackButton />
        </div>
      </main>
    </div>
  );
}

export default City;
