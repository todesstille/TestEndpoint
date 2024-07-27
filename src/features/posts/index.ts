import { Router } from "express";
import { createPostMiddleware } from "./middlewares/postValidators";
import { createPostController } from "./controllers/createPostController";
import { getPostsController } from "./controllers/getPostController";
import { findPostController } from "./controllers/findPostController";
import { modifyPostController } from "./controllers/modifyPostController";
import { adminMiddleware } from "../../global-middlewares";
import { deletePostController } from "./controllers/deletePostController";

export const postsRouter = Router();

postsRouter.get('/', getPostsController);
postsRouter.get('/:id', findPostController);
postsRouter.post('/', createPostMiddleware, createPostController);
postsRouter.put('/:id', createPostMiddleware, modifyPostController);
postsRouter.delete('/:id', adminMiddleware, deletePostController);