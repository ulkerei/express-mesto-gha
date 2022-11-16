const Cards = require('../models/card');

module.exports.getCardList = (req, res) => {
  Cards.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с id ${req.params.cardId} не найдена.` });
      } else {
        res.status(200).send({ message: `Карточка с id ${req.params.cardId} успешно удалена!` });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан некорректный id карточки.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.setCardLike = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с id ${req.params.cardId} не найдена.` });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при постановке ♥.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.deleteCardLike = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка с id ${req.params.cardId} не найдена.` });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при снятии ♥.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
