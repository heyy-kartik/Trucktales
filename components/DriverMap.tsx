"use client";

import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 28.6139, // Delhi
  lng: 77.209,
};

export default function DriverMap() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: "Sector 18, Noida",
        destination: "Connaught Place, Delhi",
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
    >
      <Marker position={center} />
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
}