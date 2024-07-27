import { Router } from "express";
import { deleteDbController } from "./controllers/deleteDbController";

export const testingRouter = Router();

testingRouter.delete('/all-data', deleteDbController);