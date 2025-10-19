import '../pages/index.css';

import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';
import { initialCards } from './cards.js';
import { createCard } from './card.js';
import { openModal, closeModal } from './modal.js';

document.querySelector('.header__logo').src = logo;
document.querySelector('.profile__image').style.backgroundImage =
  `url(${avatar})`;

// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');

const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const addForm = document.querySelector('.popup__form[name="new-place"]');

const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector(
  '.popup__input_type_description'
);

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const popupImage = imageModal.querySelector('.popup__image');
const popupCaption = imageModal.querySelector('.popup__caption');

const placesList = document.querySelector('.places__list');

function handleLike(likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}

function handleDelete(cardElement) {
  cardElement.remove();
}

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imageModal);
}

function renderCard(cardData) {
  const cardElement = createCard(cardData, handleImageClick);
  placesList.prepend(cardElement);
}

function renderInitialCards() {
  initialCards.forEach(function (cardData) {
    const cardElement = createCard(
      cardData,
      handleImageClick,
      handleLike,
      handleDelete
    );
    placesList.append(cardElement);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  renderInitialCards();
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

profileAddButton.addEventListener('click', () => {
  openModal(addModal);
});

document.querySelectorAll('.popup__close').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.popup');
    closeModal(modal);
  });
});

editForm.addEventListener('submit', evt => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(editModal);
});

addForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const placeNameInput = addForm.querySelector('.popup__input_type_card-name');
  const linkInput = addForm.querySelector('.popup__input_type_url');

  const newCard = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  renderCard(newCard);
  addForm.reset();
  closeModal(addModal);
});
