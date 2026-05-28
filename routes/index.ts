import { Router , Request , Response} from "express";
import userRouter from "./userRoute";
const api = Router();

api.use('/user' , userRouter);



export default api;