import { Router , Request , Response} from "express";
import {prisma} from '../lib/prisma';
const checkRouter = Router();

checkRouter.get('/hello' , (req : Request , res : Response) => {
    console.log('working hello');

    
    res.send('hello');
})


// Method: GET
// Route: /api/v1/user/bulk
// Query Parameter: ?filter=sachin
checkRouter.get('/bulk' , async (req : Request , res : Response) => {
    const data = await prisma.user.findMany();
    res.status(200).json({
        data : data
    })
})

export default checkRouter;