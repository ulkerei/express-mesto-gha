const Users = require('../models/user.js');

module.exports.getUserList = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send('На сервере произошла ошибка.'));
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Передан некорректный id пользователя.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const {
    name,
    about,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const {
    avatar,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь с id ${req.params.id} не найден.` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
