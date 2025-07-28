<script>
  import { Map, TileLayer, GeoJSON } from "sveaflet";
  import L from "leaflet";
  import { points } from "./points.js";
  import { onMount } from "svelte";

  function onEachFeature(feature, layer) {
    let popupContent = `<p style='font-size:0.6em;margin:5px'>${feature.properties.type}</p><p style='margin:5px'><b>${feature.properties.name}</b></p><hr><p style='font-size:0.6em;margin:5px'>Notes : <br />${feature.properties.note}</a></p>`;
    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }

    layer.bindPopup(popupContent, { });
    // layer.bindPopup(popupContent, { autoPan: false });

    layer.on("popupopen", () => {
      // Remove svg-active from all markers first
      document.querySelectorAll(".custom-svg-icon.svg-active").forEach((el) => {
        el.classList.remove("svg-active");
      });
      // Add svg-active to the current marker
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.add("svg-active");
    });

    layer.on("popupclose", () => {
      const icon = document.querySelector(`.marker-${feature.properties.ID}`);
      if (icon) icon.classList.remove("svg-active");
    });
  }

  let mapRef;

  onMount(() => {
    function fixPopupPosition() {
      document.querySelectorAll(".leaflet-popup").forEach((popup) => {
        // Use HTMLElement cast for JS:
        const el = /** @type {HTMLElement} */ (popup);
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.transform = "none";
        el.style.position = "fixed !important";
        el.style.height = "100vh";
        el.style.maxHeight = "100vh";
      });
    }

    if (mapRef && mapRef.leafletObject) {
      mapRef.leafletObject.on(
        "move zoom popupopen popupclose",
        fixPopupPosition,
      );
    }
  });

  let showModal = true;
</script>

<div class="bottom-bar">
  <div class="bottom-bar-content">
    <img src="./logo-dec.png" alt="Logo" class="bottom-bar-logo" />
    <span class="bottom-bar-title">Carte touristique de l'île d'Idjwi</span>
  </div>
</div>
<div class="left-bar"></div>
<div class="top-bar"></div>
<div class="right-bar"></div>

<div class="map-container">
  {#if showModal}
    <div class="modal-bottom-right">
      <button class="modal-close" on:click={() => (showModal = false)}>×</button
      >
      <div class="modal-content">
        <!-- <strong>Info</strong> -->
        <p>
          La province du Nord-Kivu de la République démocratique du Congo et
          l'île d'Idjwi sont connues dans le monde entier pour être une zone de
          conflit armé. Le réseau <a href="https://dec-rdc.org/" target="_blank"
            >Droits, Environnement et Citoyenneté - DEC</a
          > a créé cette carte pour renverser cette rhétorique et montrer la beauté
          et la richesse de la nature et des personnes qui vivent sur l'île d'Idjwi
          et au bord du lac Kivu.
        </p>
      </div>
    </div>
  {/if}

  <Map
    bind:this={mapRef}
    options={{
      center: [-2.22458305298245, 29.0381333965789],
      zoom: 15,
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
          const name = feature.properties.name;

          const html = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="marker-label">${name}</div>
      ${svgHtml}
    </div>
  `;

          const svgIcon = L.divIcon({
            className: `custom-svg-icon marker-${feature.properties.ID}`,
            html,
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
