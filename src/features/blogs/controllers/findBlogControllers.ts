import {Response, Request} from 'express';
import { db } from '../../../app';

export const findBlogController = (req: Request, res: Response) => {
    const blog = db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        res.status(200).send(blog);
    }
}