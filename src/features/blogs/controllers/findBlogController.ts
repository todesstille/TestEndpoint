import {Response, Request} from 'express';
import { db } from '../../../app';

export const findBlogController = async (req: Request, res: Response) => {
    const blog = await db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        res.status(200).send(blog);
    }
}