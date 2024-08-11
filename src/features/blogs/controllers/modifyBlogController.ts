import {Response, Request} from 'express';
import { db } from '../../../app';
import { validationResult } from 'express-validator';
import { processErrors } from "./helpers/processErrors";

export const modifyBlogController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(processErrors(errors));
        return;
    }
    const blog = await db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        await db.modifyBlog(req.params.id, req.body);
        res.send(204);
    }
}
