const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerController(req,res){
    const{username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const isUserAlreadyExists = await userModel.findOne({ $or: [{ email }, { username }] });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token)

    res.status(201).json({ message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
         token })


}

async function loginController(req,res){
    const{email,password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({message:"Invalid credentials"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid credentials"})
    }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token)

    res.status(200).json({ message: "User logged in successfully", user: { id: user._id, username: user.username, email: user.email } })

}





module.exports = {registerController, loginController}


