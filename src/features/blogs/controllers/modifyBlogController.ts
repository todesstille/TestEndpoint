import {Response, Request} from 'express';
import { db } from '../../../app';
import { validationResult } from 'express-validator';
import { processErrors } from "./helpers/processErrors";

export const modifyBlogController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(processErrors(errors));
        return;
    }
    const blog = db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        db.modifyBlog(req.params.id, req.body);
        res.send(204);
    }
}
