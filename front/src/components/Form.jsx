import { useNavigate } from "react-router-dom";
import { useCountries } from "../contexts/CountriesContext";
import useUrlPosition from "../hooks/useUrlPosition";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./Form.module.css";
import Button from "./Button";
import Flag from "./Flag";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import BackButton from "./BackButton";
import { useUser } from "../contexts/UserContext";

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity } = useCountries();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const [countryIso, setCountryIso] = useState("");
  const navigate = useNavigate();

  const { currentUser } = useUser();
  console.log(currentUser.id);

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError("");

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else"
            );
          setCity(data.city || data.locality || "");
          setCountry(data.countryName);
          setCountryIso(data.countryCode);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!city || !date) return;

    const newCity = {
      city,
      country,
      countryIso,
      date,
      notes,
      lat,
      lng,
      userId: currentUser.id,
    };

    console.log(newCity);

    await createCity(newCity);
    navigate("/app");
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formContainer}>
        <div className={styles.flag}>
          <Flag countryIso={countryIso} type="small" />
        </div>

        <main className={styles.row}>
          <label htmlFor="cityName">City name: </label>
          <div>
            <input
              id="cityName"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
          </div>
        </main>

        <div className={styles.row}>
          <label htmlFor="date">When did you go to {city}?</label>

          <ReactDatePicker
            id="date"
            onChange={(date) => setDate(date)}
            selected={date}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="notes">Notes about your trip to {city}</label>
          <textarea
            id="notes"
            onChange={(e) => setNotes(e.target.value)}
            value={notes}
          />
        </div>

        <div className={styles.buttons}>
          <Button type="back">ADD</Button>
          <BackButton />
        </div>
      </div>
    </form>
  );
}

export default Form;
