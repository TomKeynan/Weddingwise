import React, { useState, useEffect } from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { Typography } from "@mui/material";

function Gmap() {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = () => {
    fetch(
      "https://proj.ruppin.ac.il/cgroup70/test2/tar1/api/Suppliers/getTopVenues"
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("Fetched venues:", data);
        setVenues(data);
      })
      .catch((error) =>
        console.error("There was an error fetching the venues!", error)
      );
  };

  const handleMarkerClick = (venue) => {
    setSelectedVenue(venue);
  };

  const handleInfoWindowClose = () => {
    setSelectedVenue(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        border: "1px solid black",
      }}
    >
      <p>Number of venues: {venues.length}</p>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "80vh",
        }}
        center={{ lat: 31.6, lng: 34.61 }}
        zoom={8}
      >
        {venues.map((venue) => (
          <MarkerF
            key={venue.supplierEmail}
            position={{ lat: venue.latitude, lng: venue.longitude }}
            onClick={() => handleMarkerClick(venue)}
          />
        ))}

        {selectedVenue && (
          <InfoWindowF
            position={{
              lat: selectedVenue.latitude,
              lng: selectedVenue.longitude,
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div style={{ minWidth: "200px", padding: "5px" }}>
              <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                {selectedVenue.businessName}
              </Typography>
              <p>דירוג: {selectedVenue.rating.toFixed(2)}</p>
              <p>מתאים ל: {selectedVenue.capacity}</p>
              <p>מס' טלפון: {selectedVenue.phoneNumber}</p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}

export default Gmap;
