import {Response, Request} from 'express';
import { db } from '../../../app';

export const getBlogsController = async (req: Request, res: Response) => {
    const blogs = await db.getBlogs();
    res.status(200).json(blogs);
}
