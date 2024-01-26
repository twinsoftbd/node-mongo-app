const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const UserModel = require('../models/user');

// Register a new user
const register = async (req, res, next) => {

    /*
        if (!req.body.name || req.body.name.trim().length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Name field can not be empty'
            });
        }

        if (req.body.name.trim().length < 3) {
            return res.status(401).json({
                success: false,
                message: 'Name should be minimum 3 character'
            });
        }
    */

    const schema = Joi.object().keys({
        name: Joi.string().alphanum().min(3).max(250).required(),
        email: Joi.string().email().min(3).max(250).required(),
        password: Joi.string().min(6).max(32).required()
        //password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(6).max(32).required()
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(401).json({
            success: false,
            message: result.error.details[0].message
        });
        return;
    }

    const data = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    try {
        const dataToSave = await data.save();
        res.status(200).json({
            success: true,
            result: dataToSave,
            message: 'User register successfully.'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Login with an existing user
const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {
            expiresIn: '1 hour'
        });
        res.json({
            success: true,
            result: user,
            message: 'User login successfully.',
            token
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {register, login};
