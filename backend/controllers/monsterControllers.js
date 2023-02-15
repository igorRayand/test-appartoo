const asyncHandler = require("express-async-handler");
const Monster = require("../models/monster");
const generateToken = require("../config/generateToken");

const registerMonster = asyncHandler(async (req, res) => {
    const { login, password, role } = req.body;

    if (!login || !password || !role) {
        res.status(400);
        throw new Error("Please fill the form correctly");
    }

    const monsterExists = await Monster.findOne({ login });

    if (monsterExists) {
        res.status(400);
        throw new Error("Monster already exists");
    }

    const friends = [];

    const monster = await Monster.create({
        login,
        password,
        role,
        friends
    });

    if (monster) {
        res.status(201).json({
            _id: monster.id,
            login: monster.login,
            role: monster.role,
            friends: monster.friends,
            token: generateToken(monster._id),
        });
    } else {
        res.status(400);
        throw new Error("Failed to create monster");
    }
});

const authMonster = asyncHandler(async (req, res) => {
    const { login, password } = req.body;

    const monster = await Monster.findOne({ login }).populate("friends", "login");

    if (monster && (await monster.matchPassword(password))) {
        res.status(200).json({
            _id: monster.id,
            login: monster.login,
            role: monster.role,
            friends: monster.friends,
            token: generateToken(monster._id),
        });
    } else {
        res.status(400);
        throw new Error("Monster not found");
    }
})

const updateRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const monster = await Monster.findByIdAndUpdate(
        req.monster._id,
        {
            role,
        },
        {
            new: true
        }
    ).populate("friends", "-password");

    if (!monster) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json(monster);
    }
})

const allMonsters = asyncHandler(async (req, res) => {
    const monsters = await Monster.find({ _id: { $ne: req.monster._id } }).populate().populate("friends", "login");
    res.status(200).json({ monsters  });
})

const addFriend = asyncHandler(async (req, res) => {
    const { login } = req.body;

    var monster = await Monster.findOne({ login: login });

    if (!monster) {
        const newMonster = await Monster.create({
            login: login,
            password: "",
            role: "Guerrier",
            friends: []
        });
        monster = await Monster.findOne({ _id: newMonster._id });
    }

    const added = await Monster.findByIdAndUpdate(
        req.monster._id,
        {
            $push: { friends: monster._id },
        },
        {
            new: true
        }
    ).populate("friends", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Monster not found");
    } else {
        res.status(200);
        res.json(added);
    }

});

const removeFriend = asyncHandler(async (req, res) => {
    const { monsterId } = req.body;

    const removed = await Monster.findByIdAndUpdate(
        req.monster._id,
        {
            $pull: { friends: monsterId },
        },
        {
            new: true
        }
    ).populate("friends", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Monster not found");
    } else {
        res.status(200);
        res.json(removed);
    }
});

module.exports = { registerMonster, authMonster, allMonsters, updateRole, addFriend, removeFriend };