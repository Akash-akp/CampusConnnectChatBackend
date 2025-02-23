const User = require("../models/user.model");

const putDescription = async (req, res) => {
    try {
        const id = req.userId;
        const { description } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { description },
            { new: true, runValidators: true } // Ensures updated document is returned
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Description updated", description: updatedUser.description });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const createUser = async (req, res) => {
    try {
        const { email, password, userName } = req.body;
        const user = new User({ email, password, userName });
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { putDescription, getUser ,createUser };