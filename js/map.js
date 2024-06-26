import { activateForm } from './activation.js';
import { updateAddressField } from './form-fields.js';

const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 15;
const LOCATION_PRECISION = 5;

const mainIconConfig = {
  url: './img/main-pin.svg',
  width: 52,
  height: 52,
  anchorX: 26,
  anchorY: 52,
};

const postedIconConfig = {
  url: './img/pin.svg',
  width: 40,
  height: 40,
  anchorX: 20,
  anchorY: 40,
};

const cityCenter = {
  lat: 35.68118,
  lng: 139.76717,
};

const startCoordinate = {
  lat: 35.68118,
  lng: 139.76717,
};

let newCoordinate = startCoordinate;
let map;
let offerMarkers = [];
let mainMarker;

const addPinIcon = (icon) => {
  const pinIcon = L.icon({
    iconUrl: icon.url,
    iconSize: [icon.width, icon.height],
    iconAnchor: [icon.anchorX, icon.anchorY],
  });
  return pinIcon;
};

const getValuePrecision = (obj) => {
  const valuesObj = Object.values(obj);
  const results = [];
  valuesObj.forEach((value) => {
    const preciseValue = Number((value).toFixed(LOCATION_PRECISION));
    results.push(preciseValue);
  });
  obj.lat = results[0];
  obj.lng = results[1];
  return obj;
};

const addPostedMarker = (location, content) => {
  const postedPinMarker = L.marker(location, {
    draggable: false,
    icon: addPinIcon(postedIconConfig),
  });

  offerMarkers.push(postedPinMarker);
  postedPinMarker.addTo(map);
  postedPinMarker.bindPopup(content);
};

const clearMarkers = () => {
  for (const offerMarker of offerMarkers) {
    offerMarker.remove();
  }
  offerMarkers = [];
};

const resetMap = () => {
  map.setView(startCoordinate, ZOOM);
  updateAddressField(startCoordinate);
  mainMarker.setLatLng(startCoordinate);
};

const initMap = () => {
  map = L.map('map-canvas').setView(cityCenter, ZOOM);
  activateForm();
  updateAddressField(startCoordinate);
  // main marker
  mainMarker = L.marker(startCoordinate, {
    draggable: true,
    autoPan: true,
    icon: addPinIcon(mainIconConfig),
  })
    .on('moveend', (evt) => {
      if (evt.target.getLatLng() !== startCoordinate) {
        newCoordinate = getValuePrecision(evt.target.getLatLng());
        updateAddressField(newCoordinate);
      }
    })
    .addTo(map);
  L.tileLayer(TILE_LAYER, {
    attribution: COPYRIGHT
  }).addTo(map);
};

export { resetMap, addPostedMarker, clearMarkers, initMap };
