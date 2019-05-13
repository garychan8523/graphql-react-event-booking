const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const { transformUser } = require('./merge');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email.toLowerCase() })
            if (existingUser) {
                throw new Error('user exists already')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const newUser = new User({
                email: args.userInput.email.toLowerCase(),
                password: hashedPassword
            });
            const result = await newUser.save();
            return createdUser = transformUser(result);
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if(!user) {
                throw new Error('user not exist');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('user not exist');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
                expiresIn: '1h'
            });
            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }
        } catch (err) {
            throw err;
        }
    }
};