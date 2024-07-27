import {Response, Request} from 'express';
import { db } from '../../../app';

export const getBlogsController = (req: Request, res: Response) => {
    const blogs = db.getBlogs();
    res.status(200).json(blogs);
}
