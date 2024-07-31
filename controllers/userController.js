const req = require("express/lib/request");
const { Thought, User } = require("../models");

const userController = {
    // GET all
    getAllUsers(req, res) {
        User.find().then((users) => res.json(users)).catch((err) => res.status(500).json(err));

    },
    // CREATE user
    createUser(req, res) {
        User.create(req.body).then((dbUserData) => res.json(dbUserData)).catch((err) => res.status(500).json(err));
    },

    // UPDATE by id
    updateUser(req, res) {
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: req.body
        }, {
            runValidators: true,
            new: true
        }).then((user) => {
            !user ? res.status(404).json({ message: 'No user' }) : res.json(user);

        }).catch((err) => res.status(500).json(err));


    },

    // DELETE user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : Thought.deleteMany({
            _id: {
                $in: user.thoughts
            }
        })).then(() => res.json({ message: 'User and associated apps deleted!' })).catch((err) => res.status(500).json(err));
    },
    // GET by id
    getUserById(req, res) {
        User.findOne({ _id: req.params.id }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)).catch((err) => res.status(500).json(err));
    },
    // ADD friend
    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $addToSet: {
                friends: req.params.friendsId
            }
        }, {
            runValidators: true,
            new: true
        }).then((user) => !user ? res.status(404).json({ message: 'No friend found with that ID :(' }) : res.json(user)).catch((err) => res.status(500).json(err));
    },
    // REMOVE frienf
    removeFriend(req, res) {
        User.findOneAndUpdate({
            _id: req.params.id
        }, {
            $pull: {
                friends: req.params.friendsId
            }
        }, {
            runValidators: true,
            new: true
        }).then((user) => !user ? res.status(404).json({ message: 'No friend found with that ID :(' }) : res.json(user)).catch((err) => res.status(500).json(err));
    }
};

module.exports = userController;