import { pluralize } from './util.js';
import { addPostedMarker, clearMarkers } from './map.js';

const MAX_OFFER_COUNT = 10;

const CAPACITY_MESSAGE = {
  roomsForms: [
    'комната',
    'комнаты',
    'комнат'
  ],
  guestsForms: [
    'гостя',
    'гостей',
    'гостей'
  ]
};

const OfferNameByType = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalow': 'Бунгало',
  'hotel': 'Отель',
};

// находим template '#card'
const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

// находим контейнер для новосозданных карточек
const cardContainer = document.querySelector('#map-canvas');

// выведение сообщение по количеству комнат и гостей
const getCapacityMessage = (roomsNumber, guestsNumber) => {
  let CapacityMessage = '';
  if (guestsNumber === 0) {
    CapacityMessage = `${ roomsNumber } ${pluralize(CAPACITY_MESSAGE.roomsForms, roomsNumber)}
     не для гостей`;
  } else {
    CapacityMessage = `${ roomsNumber } ${pluralize(CAPACITY_MESSAGE.roomsForms, roomsNumber)} для
    ${ guestsNumber } ${pluralize(CAPACITY_MESSAGE.guestsForms, guestsNumber)}`;
  }
  return CapacityMessage;
};

// фильтруем нужные элементы в характиристиках съемного жилья
const filterFeatures = (features, featuresList) => {
  featuresList.forEach((featuresListItem) => {
    const isNecessary = features.some(
      (feature) => featuresListItem.classList.contains(`popup__feature--${ feature }`),
    );

    if (!isNecessary) {
      featuresListItem.remove();
    }
  });
};

// отображение загруженных данных в карточке обявления
const checkCard = (card, objKey, elementClass, contentType, specialOutcome) => {
  const element = card.querySelector(elementClass);
  if (objKey === 'undefined') {
    element.style.display = 'none';
  } else {
    if (contentType === 'textContent') {
      element.textContent = specialOutcome ?? objKey;
    }
    if (contentType === 'src') {
      element.src = objKey;
    }
  }
};

// добавляем несколько фотографий к карточке объявления
const addPhotosToContainer = (photos, photoContainer, photosContainer) => {
  if (typeof photos === 'undefined') {
    photosContainer.style.display = 'none';
  } else {
    photos.forEach((photo) => {
      photoContainer.src = photo;
      photosContainer.append(photoContainer);
      photosContainer.innerHTML += '';
    });
  }
};


// создание клонированого предложения(карточки) по шаблону
const createCard = ({ author, offer, location }) => {
  const card = cardTemplate.cloneNode(true);

  checkCard(card, author.avatar, '.popup__avatar', 'src');
  checkCard(card, offer.title, '.popup__title', 'textContent');
  checkCard(card, offer.address, '.popup__text--address', 'textContent');
  checkCard(card, offer.price, '.popup__text--price', 'textContent', `${ offer.price } ₽/ночь`);
  checkCard(card, offer.type, '.popup__type', 'textContent', OfferNameByType[offer.type]);
  checkCard(card, offer.rooms, '.popup__text--capacity', 'textContent', getCapacityMessage(offer.rooms, offer.guests));
  checkCard(card, offer.checkin, '.popup__text--time', 'textContent', `Заезд после ${ offer.checkin }, выезд до ${ offer.checkout }`);
  checkCard(card, offer.description, '.popup__description', 'textContent');

  const cardFeatures = card.querySelector('.popup__features');
  const featuresList = cardFeatures.querySelectorAll('.popup__feature');

  if (typeof offer.features === 'undefined') {
    cardFeatures.style.display = 'none';
  } else {
    filterFeatures(offer.features, featuresList);
  }

  const cardPhotos = card.querySelector('.popup__photos');
  const cardPhoto = card.querySelector('.popup__photo');

  addPhotosToContainer(offer.photos, cardPhoto, cardPhotos);

  addPostedMarker(location, card);
  return card;
};

// удаляем содержимое созданной карты/popup
const resetCard = () => {
  cardContainer.querySelectorAll('.popup').forEach((element) => element.remove());
  clearMarkers();
};

// добавление клонированного предложения в контейнер "#map-canvas", временно
const renderCards = (offers) => {
  resetCard();
  const fragment = document.createDocumentFragment();

  offers.slice(0, MAX_OFFER_COUNT).forEach((offer) => {
    const popupCard = createCard(offer);
    fragment.append(popupCard);
  });
};

export { renderCards };
