export function createCard(
  cardData,
  handleImageClick,
  handleLikeClick,
  handleDeleteClick,
  currentUserId
) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  cardLikeCount.textContent = cardData.likes.length;

  const isOwner = cardData.owner && cardData.owner._id === currentUserId;

  if (!isOwner) {
    deleteButton.style.display = 'none';
  }

  const isLiked = cardData.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  cardImage.addEventListener('click', () => handleImageClick(cardData));

  likeButton.addEventListener('click', () => {
    handleLikeClick(cardData._id, likeButton, cardLikeCount, isLiked);
  });

  deleteButton.addEventListener('click', () => {
    handleDeleteClick(cardData._id, cardElement);
  });

  return cardElement;
}
