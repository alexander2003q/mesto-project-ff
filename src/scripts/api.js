const config = {
  baseUrl: 'https://nomoreparties.co/v1/higher-front-back-dev',
  headers: {
    authorization: '7c3b1325-1804-41d6-97be-aafc37f8bb8b',
    'Content-Type': 'application/json',
  },
};

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

export function getUserInfo() {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(checkResponse);
}

export function getInitialCards() {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkResponse);
}

export function addNewCard(cardData) {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name: cardData.name,
      link: cardData.link,
    }),
  }).then(checkResponse);
}

export function deleteCard(cardId) {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(checkResponse);
}

export function likeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  }).then(checkResponse);
}

export function unlikeCard(cardId) {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then(checkResponse);
}

export function updateUserAvatar(avatarUrl) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: avatarUrl,
    }),
  }).then(checkResponse);
}

export function updateUserInfo(userData) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: userData.name,
      about: userData.about,
    }),
  }).then(checkResponse);
}
