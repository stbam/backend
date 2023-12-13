import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js';

import User from '../models/userModel.js'

// @desc Auth user/setToken 
//route POST /api/users/auth
// @access Public

const authUser = asyncHandler( async(req,res)=>{
   /* res.status(401);
    throw new Error('Something went wrong')*/
    //res.status(200).json({message:"Auth User"})
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password)) ){
        generateToken(res,user._id);
    
        res.status(201).json({
            _id:user._id,
            name: user.name,
            email: user.email
    
    
        });
       }else{
        res.status(401);
        throw new Error('Invalid  email or password');
    
       }

       

});


// @desc Register new user
//route POST /api/users/
// @access Public
const registerUser = asyncHandler( async(req,res)=>{
  /*  console.log(req.body); */
    const{name,email,password} = req.body;
   // console.log(name)

   const userExists = await User.findOne({email}); //find user using email

   if(userExists){
    res.status(400);//client error
    throw new Error("user already exists")
   }
   const user = await User.create({name,email,password});

   if(user){
    generateToken(res,user._id);

    res.status(201).json({
        _id:user._id,
        name: user.name,
        email: user.email


    });
   }else{
    res.status(400);
    throw new Error('Invalid user data');

   }


     //res.status(200).json({message:"Register User"})
 });
// @desc Logout new user
//route POST /api/users/logout
// @access Public

 const logoutUser = asyncHandler( async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires: new Date(0),

    })

    res.status(200).json({message:"User logged out"})
});

// @desc Get user profile
//route     Get /api/users/profile
// @access Private      //needs token
const getUserProfile = asyncHandler( async(req,res)=>{ 

    const user = {
        _id: req.user._id,
        name:req.user.name,
        email:req.user.email,
    }
     res.status(200).json({user})

 });

 // @desc   Update user profile
//route     PUT /api/user/profile
// @access  Private      //needs token
const updateUserProfile = asyncHandler( async(req,res)=>{ 
    //res.status(200).json({message:"Update user profile"})
    const user = await User.findById(req.user._id);

    if(user){
            user.name= req.body.name || user.name;
            user.email= req.body.email || user.email;
            if(req.body.password){
                    user.password = req.body.password;
            }
        const updatedUser = await user.save();
            res.status(200).json({
                _id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,

            })

    }else{
        res.status(404);
        throw new Error('User not found')
    }

});



export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};
