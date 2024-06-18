import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { firstname, lastname, username, email, mobile, password, confirmpassword } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;

    if (!username || !email || !password || !mobile || !firstname || !lastname || !confirmpassword ||
        username === "" || email === "" || password === "" || mobile === "" || firstname === "" || lastname === "" || confirmpassword === "") {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    } else if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    } else if (!mobileRegex.test(mobile)) {
        return res.status(400).json({ success: false, message: 'Invalid mobile number format' });
    } else if (!passwordRegex.test(password)) {
        return res.status(400).json({ success: false, message: 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).' });
    } else if (username.length < 7 || username.length > 20) {
        return res.status(400).json({ success: false, message: 'Username must be between 7 and 20 characters' });
    } else if (firstname.length < 2 || firstname.length > 10) {
        return res.status(400).json({ success: false, message: 'First name must be between 2 and 10 characters' });
    } else if (lastname.length < 2 || lastname.length > 20) {
        return res.status(400).json({ success: false, message: 'Last name must be between 2 and 20 characters' });
    } else if (password !== confirmpassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const hashedPassword2 = bcryptjs.hashSync(confirmpassword, 10);
        const newUser = new User({ firstname, lastname, username, email, mobile, password: hashedPassword, confirmpassword: hashedPassword2 });
        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        next(error); 
    }


};

export const signin = async(req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password || username === "" || password === "") {
        return next(errorHandler(400, "All fields are required"));
    }
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(400, 'Invalid Credentials!'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000);

        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
           .status(200).json({ success: true, ...rest });
    } catch (error) {
        next(error);
    }
};


  export const signout = (req, res, next) => {
    try {
      res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
      next(error);
    }
  };

  export const google = async (req,res,next) => {
    try{
      const user = await User.findOne({email:req.body.email});
      if (user){
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        const{password:hashedPassword, ...rest} = user._doc;
        
        res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
      }else{
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
          const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
          const newUser = new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8), 
          email:req.body.email, password: hashedPassword, profilePicture:req.body.photo });
  
          await newUser.save();
           const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
           const{password:hashedPassword2, ...rest} = newUser._doc;
           const expiryDate = new Date(Date.now()+3600000);
           res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
      }
    }catch(error){
      next(error);
    }
  }
