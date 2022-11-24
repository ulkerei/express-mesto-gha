const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const DuplicateError = require('../errors/duplicate-error');

module.exports.getUserList = (req, res, next) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с id ${req.params.id} не найден.`);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя.'));
      } else { next(err); }
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с id ${req.user._id} не найден.`);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя.'));
      } else { next(err); }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new DuplicateError('Пользователь с таким email уже существует.'));
      } else { next(err); }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '50f9baa64b85bd4b0c60974fd6e5d1c426cd07f7d3de2d5d1665a1aa038ca31e', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 7 * 24 * 3600000,
        httpOnly: true,
      }).send({ message: 'Токен в куках!' });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильное имя пользователя или пароль.'));
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с id ${req.params.id} не найден.`);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } else { next(err); }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с id ${req.params.id} не найден.`);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
      } else { next(err); }
    })
    .catch(next);
};
