import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import type { LeafletMouseEvent } from "leaflet";
import { useRouter } from "next/navigation";
import "./WorldMap.css";

const WorldMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: "", x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    fetch('/countries.geojson')
      .then((response) => response.json())
      .then((data) => setGeoData(data))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }, []);

  const handleCountryClick = (e: LeafletMouseEvent) => {
    const countryName = e.target.feature.properties.ADMIN;
    router.push(`country/${countryName.toLowerCase()}`);
  };

  const handleCountryMouseOver = (e: LeafletMouseEvent) => {
    const countryName = e.target.feature.properties.ADMIN;
    setTooltip({
      visible: true,
      name: countryName,
      x: e.originalEvent.pageX,
      y: e.originalEvent.pageY
    });
  };

  const handleCountryMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  if (!geoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {tooltip.visible && (
        <div 
        className="countryTooltip"
        style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
        >
          {tooltip.name}
        </div>
      )}


      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <GeoJSON
          data={geoData}
          onEachFeature={(feature, layer) => {
            layer.on("click", handleCountryClick);
            layer.on("mouseover", handleCountryMouseOver);
            layer.on("mouseout", handleCountryMouseOut);
          }}
        />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
