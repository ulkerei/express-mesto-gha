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
    .catch((err) => {
    /*  if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else */ { next(err); }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с id ${req.params.cardId} не найдена.`);
      } else {
        if (card.owner !== req.user._id) {
          throw new ForbiddenError('Нельзя удалить чужую карточку');
        }
        res.status(200).send({ message: `Карточка с id ${req.params.cardId} успешно удалена!` });
      }
    })
    .catch((err) => {
    /*  if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id карточки.'));
      } else */ { next(err); }
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
    .catch((err) => {
    /*  if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при постановке ♥.'));
      } else */ { next(err); }
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
    .catch((err) => {
    /*  if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при снятии ♥.'));
      } else */ { next(err); }
    })
    .catch(next);
};
