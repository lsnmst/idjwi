<script>
  import L from "leaflet";
  import "leaflet-minimap";
  import { points } from "./points.js";
  import SearchPoints from "./components/SearchPoints.svelte";
  import { onMount } from "svelte";

  let showModal = true;
  let map;
  let geoJsonLayer;
  let activeMarkerID = null;
  let mapEl;

  function createIcon(feature, zoom = 15) {
    const { svgHtml, iconWidth, iconHeight, name, ID } = feature.properties;
    const baseZoom = 15;
    const scale = Math.pow(1.2, zoom - baseZoom);
    const newWidth = iconWidth * scale;
    const newHeight = iconHeight * scale;
    const showLabel = zoom > 14;

    return L.divIcon({
      className: `custom-svg-icon marker-${ID}`,
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          ${showLabel ? `<div class="marker-label">${name}</div>` : ""}
          ${svgHtml}
        </div>`,
      iconSize: [newWidth, newHeight],
      iconAnchor: [newWidth / 2, newHeight / 2],
    });
  }

  function onEachFeature(feature, layer) {
    const popupContent = `
      <hr style='height:4px;background-color:${feature.properties.hr};border:none;'>
      <p style='font-size:0.6em;margin:5px'>${feature.properties.type}</p>
      <p style='margin:5px'><b>${feature.properties.name}</b></p>
      <hr>
      <p style='font-size:0.6em;margin:5px'>${feature.properties.note}</p>`;

    layer.bindPopup(popupContent);

    layer.on("popupopen", () => {
      document
        .querySelectorAll(".custom-svg-icon.svg-active")
        .forEach((el) => el.classList.remove("svg-active"));
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.add("svg-active");
      activeMarkerID = feature.properties.ID;
    });

    layer.on("popupclose", () => {
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.remove("svg-active");
      activeMarkerID = null;
    });
  }

  function addGeoJson() {
    geoJsonLayer = L.geoJSON(points, {
      pointToLayer: (feature, latlng) => {
        const marker = L.marker(latlng, {
          icon: createIcon(feature),
        });

        marker.on("add", () => {
          map.on("zoomend", () => {
            const zoom = map.getZoom();
            marker.setIcon(createIcon(feature, zoom));

            setTimeout(() => {
              if (activeMarkerID === feature.properties.ID) {
                const icon = document.querySelector(
                  `.marker-${feature.properties.ID}`,
                );
                if (icon) icon.classList.add("svg-active");
              }
            }, 0);
          });
        });

        return marker;
      },
      onEachFeature,
    });

    geoJsonLayer.addTo(map);
  }

  function handleSelectPoint(point) {
    const [lng, lat] = point.coordinates;
    const target = L.latLng(lat, lng);
    const targetZoom = Math.max(14, Math.min(map.getMaxZoom(), 15));

    map.flyTo(target, targetZoom, { duration: 1.2 });

    setTimeout(() => {
      geoJsonLayer.eachLayer((layer) => {
        if (layer.feature?.properties?.ID === point.id) {
          layer.openPopup();
        }
      });

      document
        .querySelectorAll(".custom-svg-icon.svg-active")
        .forEach((el) => el.classList.remove("svg-active"));

      const icon = document.querySelector(`.marker-${point.id}`);
      if (icon) icon.classList.add("svg-active");
    }, 700);
  }

  onMount(() => {
    map = L.map(mapEl, {
      center: [-2.22458, 29.03813],
      zoom: 15,
      maxBounds: [
        [-2.3293, 28.9075],
        [-1.8339, 29.207],
      ],
      maxBoundsViscosity: 0.8,
      zoomControl: false,
    });

    const mainTileLayer = L.tileLayer(
      "https://www.alessandromusetta.com/geo/tiles/idjwi/{z}/{x}/{y}.jpg",
      {
        minZoom: 12,
        maxZoom: 16,
        attribution: "",
        noWrap: true,
        bounds: [
          [-2.3293, 28.9075],
          [-1.8339, 29.207],
        ],
      },
    );

    mainTileLayer.addTo(map);

    // ✅ Add MiniMap
    const miniMapLayer = L.tileLayer(
      "https://www.alessandromusetta.com/geo/tiles/minimapidjwi/{z}/{x}/{y}.png",
      {
        minZoom: 9,
        maxZoom: 12,
      },
    );

    const miniMap = new L.Control.MiniMap(miniMapLayer, {
      toggleDisplay: true,
      minimized: false,
      position: "topright",
      width: 150,
      height: 150,
      aimingRectOptions: { color: "#ff780080", weight: 1, fillOpacity: 0 },
      shadowRectOptions: { color: "#21354780", weight: 1, fillOpacity: 0 },
    });

    miniMap.addTo(map);

    L.control.scale({ maxWidth: 150 }).addTo(map);

    addGeoJson();
  });
</script>

<div class="bottom-bar">
  <div class="bottom-bar-content">
    <img src="./logo-dec.png" alt="Logo" class="bottom-bar-logo" />
    <span class="bottom-bar-title"
      >carte du tourisme écoculturel de l'île d'Idjwi</span
    >
  </div>
</div>

<div class="left-bar"></div>
<div class="top-bar"></div>
<div class="right-bar"></div>

<div bind:this={mapEl} class="map-container">
  {#if showModal}
    <div class="modal-bottom-right">
      <button class="modal-close" on:click={() => (showModal = false)}>×</button
      >
      <div class="modal-content">
        <h3>CARTOGRAPHIER LA MÉMOIRE DES ANCÊTRES POUR UN AVENIR DURABLE</h3>
        <p>
          La province du Nord et du Sud Kivu de la République démocratique du
          Congo et l'île d'Idjwi sont connues dans le monde entier pour être une
          zone de conflit armé. Le réseau
          <a href="https://dec-rdc.org/" target="_blank"
            >Droits, Environnement et Citoyenneté - DEC</a
          >
          a créé cette carte pour renverser cette rhétorique et montrer la beauté
          et la richesse de la nature et des personnes qui vivent sur l'île d'Idjwi
          et au bord du lac Kivu.<br /><br />Contactez DEC par e-mail à
          <a href="mailto:dec.organisation21@gmail.com"
            >dec.organisation21@gmail.com</a
          > pour contribuer à la carte, obtenir plus d'informations et donner pour
          supporter l'initiative.
        </p>
      </div>
    </div>
  {/if}
</div>

<SearchPoints onSelect={handleSelectPoint} />

<style>
  .map-container {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    background-color: white !important;
  }

  .custom-svg-icon {
    pointer-events: auto;
    transition: transform 0.2s ease;
  }

  .svg-active {
    transform: scale(1.3);
    filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.4));
  }

  .marker-label {
    font-size: 0.7em;
    background: white;
    padding: 2px 5px;
    border-radius: 4px;
    margin-bottom: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .minimapz {
    z-index: 9999;
  }
</style>
