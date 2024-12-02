import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

const WorldMap = () => {
  const [geoData, setGeoData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/countries.geojson')
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const handleCountryClick = (e: any) => {
    const countryName = e.target.feature.properties.ADMIN;
    router.push(`country/${countryName.toLowerCase()}`);
  };

  if (!geoData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <GeoJSON
          data={geoData}
          onEachFeature={(feature, layer) => {
            const countryName = feature.properties.ADMIN;
            layer.bindPopup(`<b>${countryName}</b>`);
            layer.on("click", handleCountryClick);
          }}
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
