const express = require('express');
const { registerMonster, authMonster, allMonsters, updateRole, addFriend, removeFriend } = require("../controllers/monsterControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerMonster).get(protect, allMonsters).put(protect, updateRole);
router.route("/login").post(authMonster);
router.route("/add").put(protect, addFriend);
router.route("/remove").put(protect, removeFriend);

module.exports = router;