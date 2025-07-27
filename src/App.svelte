<script>
  import { Map, TileLayer, GeoJSON } from "sveaflet";
  import L from "leaflet";
  import { points } from "./points.js";
  import { onMount, tick } from "svelte";

  function onEachFeature(feature, layer) {
    let popupContent = `<span><b>${feature.properties.name}</b></span><br /><span>Project area: ${feature.properties.area} Ha</span><hr><p>Project ID <a href="${feature.properties.link}" target="_blank" rel="noopener noreferrer">${feature.properties.ID}</a></p>`;

    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent, { autoPan: false });
    layer.on("popupopen", () => {
      // Add a class to the marker's icon when popup is open
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.add("svg-active");
    });
    layer.on("popupclose", () => {
      // Remove the class when popup closes
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.remove("svg-active");
    });
  }

  let mapRef;

  onMount(async () => {
    await tick();
    if (mapRef && mapRef.leafletObject) {
      // Remove any existing zoom control
      if (mapRef.leafletObject.zoomControl) {
        mapRef.leafletObject.zoomControl.remove();
      }
      // Add a new zoom control in the top right
      L.control.zoom({ position: "topright" }).addTo(mapRef.leafletObject);
    }
  });
</script>

<div class="map-container">
  <Map
    bind:this={mapRef}
    options={{
      center: [-2.10383, 29.05173],
      zoom: 13,
      maxBounds: [
        [-2.3293, 28.9075], // Southwest corner
        [-1.8339, 29.207], // Northeast corner
      ],
      zoomControl: false,
    }}
  >
    <TileLayer
      url={"https://www.alessandromusetta.com/geo/tiles/idjwi/{z}/{x}/{y}.jpg"}
      options={{
        minZoom: 11,
        maxZoom: 16,
        attribution: "",
      }}
    />
    <GeoJSON
      json={[points]}
      options={{
        style(feature) {
          return feature.properties && feature.properties.style;
        },
        onEachFeature,
        pointToLayer(feature, latlng) {
          const svgHtml = feature.properties.svgHtml;
          const iconWidth = feature.properties.iconWidth;
          const iconHeight = feature.properties.iconHeight;

          const svgIcon = L.divIcon({
            className: `custom-svg-icon marker-${feature.properties.ID}`,
            html: svgHtml,
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [iconWidth / 2, iconHeight / 2],
          });
          return L.marker(latlng, { icon: svgIcon });
        },
      }}
    />
  </Map>
</div>

<style>
  .map-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white !important;
  }

  @media (max-width: 768px) {
  }
</style>
