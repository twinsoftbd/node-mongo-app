const express = require('express');
const UserModel = require('../models/user');
const {authenticate} = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    //await UserModel.deleteMany();
    const data = await UserModel.find();
    await res.json(data);
    //res.json({message: "Welcome to Nodejs backend application."});
});

module.exports = router;
