const axios = require('axios');
const Dev = require('../models/Dev');
const UserNotExists

module.exports = {
    async index (req,res) {

        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },                //Que não seja usuário
                { _id: { $nin: loggedDev.likes } },    //Que não esteja na lista de likes
                { _id: { $nin: loggedDev.dislikes } }  //Que não esteja na lista de dislikes
            ]
        })

        return res.json(users);

    },
    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({user: username});

        if(userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`${process.env.API_GIT}/${username}`)

        const { name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        })

        res.json(dev);
    },

    async show(req,res) {
        const
    }
}