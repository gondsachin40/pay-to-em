import { Router , Request , Response} from "express";
import {prisma} from '../lib/prisma';
const checkRouter = Router();

checkRouter.get('/hello' , (req : Request , res : Response) => {
    console.log('working hello');

    
    res.send('hello');
})



export default checkRouter;