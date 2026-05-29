import { Router , Request , Response} from "express";
import z, { string } from 'zod';
import bcrypt from 'bcrypt';
import {prisma} from '../lib/prisma';
import { error } from "node:console";
import jwt , {Secret , JwtPayload} from "jsonwebtoken";
const authRouter = Router();
const secretKey = "nothing_is_working_here";
const saltRounds = 8


const signUpSchema = z.object({
    username : z.string().min(2).max(30),
    password : z.string().min(6).max(30)
});

type SignUp = z.infer<typeof signUpSchema>;


const signInSchema = z.object({
    username : z.string().min(2).max(30),
    password : z.string().min(6).max(30)
});

type SignIn = z.infer<typeof signUpSchema>;

authRouter.post('/signup', async(req : Request , res : Response) => {
    const result = signUpSchema.safeParse(req.body);

    if(!result.success){
        return res.status(404).json({errors : result.error.issues});
    }

    const data = result.data;
    
    let User = await prisma.user.findUnique({
        where : { username : data.username}
    })
    if(!User){
        return res.status(411).json({
            msg : "username aldready taken / Incorrect inputs",
        })
    }
    data.password = await bcrypt.hash(data.password, saltRounds);
    
    const user =  await prisma.user.create({
        data : {
            username : data.username,
            password : data.password
        }
    })

    res.status(200).json({
        msg : "user signup successfully",
        data : user
    })

})
authRouter.post('/signin', async(req : Request , res : Response) => {
    const result = signInSchema.safeParse(req.body);

    if(!result.success){
        return res.status(404).json({errors : result.error.issues});
    }

    const data = result.data;
    //current_password , hashpassword
    let user = await prisma.user.findUnique({
        where : { username : data.username}
    })
    if(!user){
        return res.status(411).json({
            msg : "Username don't exist",
        })
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if(isMatch){
        const token = jwt.sign({_id : user.id , username : user.username} , secretKey  , {
            expiresIn : '2 days'
        });
        
        res.status(200).json({
        msg : "user signin successfully",
        data : user,
        token : token
        })
    }else{
         res.status(404).json({
        msg : "password is not correct"
    })
    }

})

export default authRouter;
export {secretKey};