interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

export async function geocodeLocation(query: string): Promise<GeocodingResult | null> {
  try {
    // Use Nominatim (OpenStreetMap's geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query + " India"
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "TruckTales/1.0", // Required by Nominatim
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": "TruckTales/1.0",
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}