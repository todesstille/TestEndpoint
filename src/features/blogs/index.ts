import { Router } from "express";
import { createBlogMiddleware } from "./middlewares/blogValidators";

export const blogsRouter = Router();

import { createBlogController } from "./controllers/createBlogController";
import { getBlogsController } from "./controllers/getBlogController";
import { findBlogController } from "./controllers/findBlogController";
import { modifyBlogController } from "./controllers/modifyBlogController";
import { adminMiddleware } from "../../global-middlewares";
import { deleteBlogController } from "./controllers/deleteBlogController";

blogsRouter.get('/', getBlogsController);
blogsRouter.get('/:id', findBlogController);
blogsRouter.post('/', createBlogMiddleware, createBlogController);
blogsRouter.put('/:id', createBlogMiddleware, modifyBlogController);
blogsRouter.delete('/:id', adminMiddleware, deleteBlogController);