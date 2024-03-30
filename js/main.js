import { showAlertMessage } from './util.js';
// import { getObjects } from './data.js';
import { renderCards } from './popup.js';
import { disableForm, disableFilters, activateFilters } from './form.js';
import './validate-form-fields.js';
import { resetForm, setOnFormSubmit } from './validate-form.js';
import { initMap, resetMap } from './map.js';
import './form-fields.js';
import { getData, sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './submit-message.js';
import { initializeOfferFilters } from './map-filters.js';

setOnFormSubmit (async (data) => {
  try {
    await sendData(data);
    showSuccessMessage();
    resetForm();
    resetMap();
  } catch {
    showErrorMessage();
  }
});

disableFilters();
disableForm();
initMap();

try {
  const data = await getData();
  renderCards(data);
  activateFilters();
  initializeOfferFilters(data);
} catch (err) {
  // console.error(err);
  showAlertMessage(err.message);
}
