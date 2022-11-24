const Cards = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCardList = (req, res, next) => {
  Cards.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${req.params.cardId} не найдена.`);
      } else if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        Cards.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(200).send({ message: `Карточка с id ${req.params.cardId} успешно удалена!` }));
      }
    })
    .catch(next);
};

module.exports.setCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${req.params.cardId} не найдена.`);
      } else {
        res.status(200).send(card);
      }
    })
    .catch(next);
};

module.exports.deleteCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${req.params.cardId} не найдена.`);
      } else {
        res.status(200).send(card);
      }
    })
    .catch(next);
};
