import {Response, Request} from 'express';
import { db } from '../../../app';

export const getPostsController = async (req: Request, res: Response) => {
    const posts = await db.getPosts();
    res.status(200).json(posts);
}
