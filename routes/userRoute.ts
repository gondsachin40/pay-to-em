import { Router , Request , Response} from "express";
import z, { string } from 'zod';
import bcrypt from 'bcrypt';
const userRouter = Router();
const secretKey = "nothing_is_working_here";
const saltRounds = 8


const signUpSchema = z.object({
    username : z.string().min(2).max(30),
    password : z.string().min(6).max(30)
});

type SignUp = z.infer<typeof signUpSchema>;
userRouter.post('/signup', async(req : Request , res : Response) => {
    const result = signUpSchema.safeParse(req.body);

    if(!result.success){
        return res.status(404).json({errors : result.error.issues});
    }

    const data = result.data;
    console.log(data);
    data.password = await bcrypt.hash(data.password, saltRounds);


    console.log(data);
    res.status(200).json({
        msg : "user signup successfully"
    })


})

userRouter.get('/hello' , (req : Request , res : Response) => {
    console.log('working hello');
    res.send('hello');
})



export default userRouter;