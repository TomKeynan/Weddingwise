
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// const mapContainerStyle = {// Map's size
//   width: '100%',
//   height: '80vh'
// };

// const center = {// Coordinates for map's initial position
//   lat: 31.60, 
//   lng: 34.61
// };

// function Gmap() {
//   const [venues, setVenues] = useState([]);
//   const [selectedVenue, setSelectedVenue] = useState(null);

//   useEffect(() => {
//     fetch('https://localhost:44359/api/Suppliers/getTopVenues')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         setVenues(data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the venues!', error);
//       });
//   }, []);

//   return (
//     <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
//     <LoadScript googleMapsApiKey="AIzaSyCSXv1ZziH2SJEcGQIp8EJMytapWnPjytQ">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={8}
//       >
//         {venues.map(venue => (
//           <Marker
//             key={venue.supplierEmail}
//             position={{ lat: venue.latitude, lng: venue.longitude }}
//             onClick={() => setSelectedVenue(venue)}
//           />
//         ))}

//         {selectedVenue && (
//           <InfoWindow
//             position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
//             onCloseClick={() => setSelectedVenue(null)}
//           >
//             <div>
//               <h2>{selectedVenue.businessName}</h2>
//               <p>דירוג: {selectedVenue.rating.toFixed(2)}</p>
//               <p>מתאים ל: {selectedVenue.capacity}</p>
//               <p>Phone: {selectedVenue.phoneNumber}</p>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     </LoadScript>
//     </div>
//   );
// }


// export default Gmap;