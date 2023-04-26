const map = L.map("mapid").setView([10.5833, -85.6833], 9);
const infoDiv = document.querySelector("#info");
const latElement = document.querySelector("#lat");
const lngElement = document.querySelector("#lng");
const direccion = document.querySelector("#dir");

const osmLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "Map data &copy; OpenStreetMap contributors",
  }
);

const esriSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri",
  }
);

osmLayer.addTo(map);

const baseLayers = {
  OpenStreetMap: osmLayer,
  Satelite: esriSatelite,
};

const marker = L.marker([10.5833, -85.6833], {
  draggable: true,
}).addTo(map);

marker.on("dragend", async function (e) {
  const { lat, lng } = e.target.getLatLng();
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    { mode: "cors" }
  );

  const data = await response.json();

  const formattedData = JSON.stringify(data, null, 2);
  infoDiv.innerHTML = "<pre>" + formattedData + "</pre>";

  const h = data?.lat ?? 0;
  const s = data?.lon ?? 0;
  const displayName = data?.display_name ?? "";
  latElement.textContent = h;
  lngElement.textContent = s;
  direccion.textContent = displayName;
});

const geocoder = L.Control.geocoder({
  defaultMarkGeocode: false,
})
  .on("markgeocode", function (e) {
    const { center } = e.geocode;
    marker.setLatLng(center);
    map.setView(center, 16);
  })
  .addTo(map);

L.control
  .scale({
    position: "bottomright",
  })
  .addTo(map);

L.control.layers(baseLayers).addTo(map);
