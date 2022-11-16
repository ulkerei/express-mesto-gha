const userRouter = require('express').Router();
const {
  getUserList,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/user.js');

userRouter.get('/', getUserList);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
