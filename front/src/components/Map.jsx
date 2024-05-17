/* eslint-disable react/prop-types */
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useCountries } from "../contexts/CountriesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUrlPosition from "../hooks/useUrlPosition";
import Flag from "./Flag";

function Map() {
  const { locations } = useCountries();
  const { position, getPosition } = useGeolocation();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if (position) setMapPosition([position.lat, position.lng]);
  }, [position]);

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  return (
    <div className={styles.mapContainer}>
      <Button type="primary" onClick={getPosition}>
        Use your position
      </Button>
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
        key={locations.id}
      >
        <TileLayer
          // noWrap={true}

          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((city) => (
          <Marker key={city.id} position={[city.lat, city.lng]}>
            <Popup>
              <span>
                <Flag countryIso={city.countryIso} country={city.country} />
              </span>
              <span>{city.city}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <SetCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function SetCenter({ position }) {
  const map = useMap();
  map.flyTo(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
