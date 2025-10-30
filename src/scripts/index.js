import '../pages/index.css';
import logo from '../images/logo.svg';
import { createCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  updateUserAvatar,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from './api.js';

document.querySelector('.header__logo').src = logo;

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

enableValidation(validationConfig);

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit');

const editModal = document.querySelector('.popup_type_edit');
const addModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const deleteModal = document.querySelector('.popup_type_delete-card');
const avatarModal = document.querySelector('.popup_type_avatar');

const editForm = document.querySelector('.popup__form[name="edit-profile"]');
const addForm = document.querySelector('.popup__form[name="new-place"]');
const deleteForm = document.querySelector('.popup__form[name="delete-card"]');
const avatarForm = document.querySelector('.popup__form[name="avatar-form"]');

const nameInput = editForm.querySelector('.popup__input_type_name');
const descriptionInput = editForm.querySelector(
  '.popup__input_type_description'
);

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const popupImage = imageModal.querySelector('.popup__image');
const popupCaption = imageModal.querySelector('.popup__caption');

const placesList = document.querySelector('.places__list');

let currentUserId = '';
let cardToDelete = { id: null, element: null };

function handleLikeClick(cardId, likeButton, likeCountElement, isLiked) {
  const likeFunction = isLiked ? unlikeCard : likeCard;

  likeFunction(cardId)
    .then(updatedCard => {
      likeCountElement.textContent = updatedCard.likes.length;

      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch(err => {
      console.log('Ошибка при обновлении лайка:', err);
    });
}

function handleDelete(cardId, cardElement) {
  cardToDelete.id = cardId;
  cardToDelete.element = cardElement;
  openModal(deleteModal);
}

function handleImageClick(cardData) {
  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(imageModal);
}

function renderCard(cardData) {
  const cardElement = createCard(
    cardData,
    handleImageClick,
    handleLikeClick,
    handleDelete,
    currentUserId
  );
  placesList.prepend(cardElement);
}

function renderInitialCards(cards) {
  cards.forEach(function (cardData) {
    renderCard(cardData);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      currentUserId = userData._id;
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      renderInitialCards(cards);
    })
    .catch(err => {
      console.log('Ошибка при загрузке данных:', err);
    });
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  clearValidation(editForm, validationConfig);
  openModal(editModal);
});

profileAddButton.addEventListener('click', () => {
  clearValidation(addForm, validationConfig);
  openModal(addModal);
});

avatarEditButton.addEventListener('click', () => {
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

document.querySelectorAll('.popup__close').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.popup');
    closeModal(modal);
  });
});

addForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const placeNameInput = addForm.querySelector('.popup__input_type_card-name');
  const linkInput = addForm.querySelector('.popup__input_type_url');

  const submitButton = addForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Создание...';

  const newCard = {
    name: placeNameInput.value,
    link: linkInput.value,
  };

  addNewCard(newCard)
    .then(cardData => {
      renderCard(cardData);
      addForm.reset();
      clearValidation(addForm, validationConfig);
      closeModal(addModal);
    })
    .catch(err => {
      console.log('Ошибка при добавлении карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

deleteForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const submitButton = deleteForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Удаление...';

  deleteCard(cardToDelete.id)
    .then(() => {
      cardToDelete.element.remove();
      closeModal(deleteModal);
      cardToDelete = { id: null, element: null };
    })
    .catch(err => {
      console.log('Ошибка при удалении карточки:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

avatarForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const avatarUrlInput = avatarForm.querySelector(
    '.popup__input_type_avatar-url'
  );

  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Сохранение...';

  updateUserAvatar(avatarUrlInput.value)
    .then(userData => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
      closeModal(avatarModal);
    })
    .catch(err => {
      console.log('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

editForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const submitButton = editForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  submitButton.textContent = 'Сохранение...';

  const updatedUserInfo = {
    name: nameInput.value,
    about: descriptionInput.value,
  };

  updateUserInfo(updatedUserInfo)
    .then(userData => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editModal);
    })
    .catch(err => {
      console.log('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
});
