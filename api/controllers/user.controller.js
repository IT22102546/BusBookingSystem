import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) {
        return next (errorHandler(401,'You can update only your Account'))
    }

    try {
      if (req.body.password) {
       
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
        if (req.body.username) {
            if (req.body.username.length < 7 || req.body.username.length > 20) {
              return next(
                errorHandler(400, 'Username must be between 7 and 20 characters')
              );
            }
         
          }

          if (req.body.mobile) {
            const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
            if (!mobileRegex.test(req.body.mobile)) {
                return next(errorHandler(400, 'Invalid mobile number format.'));
            }
        }
       

       const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set : {
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                profilePicture:req.body.profilePicture,
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                mobile:req.body.mobile
            }
        },
        {new:true}
       );
       const {password , ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }

}

export const deleteUser = async(req,res,next)=>{
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
  
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been Deleted...")
    } catch (error) {
        next(error)
    }
  }
  export const signout = (req, res, next) => {
    try {
      res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
      next(error);
    }
  };