import {Response, Request} from 'express';
import { db } from '../../../app';

export const deleteBlogController = (req: Request, res: Response) => {
    const blog = db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        db.deleteBlog(req.params.id);
        res.send(204);
    }
}