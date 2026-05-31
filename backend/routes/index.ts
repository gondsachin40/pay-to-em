import { Router , Request , Response} from "express";
import authRouter from "./authRouter";
import middleware from "../middlewares/userMiddleware";
import checkRouter from "./checkRouter";
import account from "./accountRouter";
const api = Router();

api.use('/user' , authRouter);
api.use('/user' , middleware , checkRouter);


api.use('/account' , middleware ,account);

export default api;
