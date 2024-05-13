import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
};

const center = {
  lat: 31.6,
  lng: 34.61,
};
const libraries = ["places"];

function Gmap() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = () => {
    fetch("https://localhost:44359/api/Suppliers/getTopVenues")
      .then((response) => response.json())
      .then((data) => setVenues(data))
      .catch((error) =>
        console.error("There was an error fetching the venues!", error)
      );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "90%",
        border: "1px solid black",
      }}
    >
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={8}>
        {venues.map((venue) => (
          <MarkerF
            key={venue.supplierEmail}
            position={{ lat: venue.latitude, lng: venue.longitude }}
            onClick={() => setSelectedVenue(venue)}
          />
        ))}

        {selectedVenue && (
          <InfoWindow
            position={{
              lat: selectedVenue.latitude,
              lng: selectedVenue.longitude,
            }}
            onCloseClick={() => setSelectedVenue(null)}
          >
            <div>
              <h2>{selectedVenue.businessName}</h2>
              <p>דירוג: {selectedVenue.rating.toFixed(2)}</p>
              <p>מתאים ל: {selectedVenue.capacity}</p>
              <p>מס' טלפון: {selectedVenue.phoneNumber}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default Gmap;
