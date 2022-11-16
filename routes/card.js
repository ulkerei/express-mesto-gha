const cardRouter = require('express').Router();
const {
  getCardList,
  createCard,
  deleteCard,
  setCardLike,
  deleteCardLike,
} = require('../controllers/card');

cardRouter.get('/', getCardList);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', setCardLike);
cardRouter.delete('/:cardId/likes', deleteCardLike);

module.exports = cardRouter;
