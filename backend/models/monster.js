const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const monster = mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monster"
    }],
}, { timestamps: true });

monster.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

monster.pre('save', async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const Monster = mongoose.model("Monster", monster);

module.exports = Monster;