import jwt  from "jsonwebtoken";

const generateToken = (res,userId)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"30d"
    })

    res.cookie('jwt',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite:'strict',
         maxAge:30 *40* 60 *60 *1000 //age calc from seconds to 30 days
    })
}

export default generateToken;