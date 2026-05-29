import { Router , Request , Response} from "express";
import authRouter from "./authRouter";
import middleware from "../middlewares/userMiddleware";
import checkRouter from "./checkRouter";
const api = Router();

api.use('/user' , authRouter);
api.use('/user' , middleware , checkRouter);

export default api;
