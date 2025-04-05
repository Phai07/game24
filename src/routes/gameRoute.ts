import { Hono } from "hono";
import {
  getAllAnswers,
  getAnswerById,
  deleteAnswer,
  updateAnswer,
  solveGame24,
} from "../controllers/game24Controller.js";
import authUser from "./../middleware/auth.js";

const gameRouter = new Hono();

gameRouter.post("/solve", authUser, solveGame24);
gameRouter.get("/answers", authUser, getAllAnswers);
gameRouter.get("/answers/:id", authUser, getAnswerById);
gameRouter.put("/answers/:id", authUser, updateAnswer);
gameRouter.delete("/answers/:id", authUser, deleteAnswer);

export default gameRouter;
