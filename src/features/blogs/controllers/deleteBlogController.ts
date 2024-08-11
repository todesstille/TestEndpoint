import {Response, Request} from 'express';
import { db } from '../../../app';

export const deleteBlogController = async (req: Request, res: Response) => {
    const blog = await db.findBlogs(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        await db.deleteBlog(req.params.id);
        res.send(204);
    }
}