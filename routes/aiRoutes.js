import expess from "express";
import {auth} from "../middlewares/auth.js";
import { generateArticle } from "../controllers/aiController.js";

const aiRouter = expess.Router();

aiRouter.post('/generate-article', auth, generateArticle)

export default aiRouter