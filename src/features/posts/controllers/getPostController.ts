import {Response, Request} from 'express';
import { db } from '../../../app';

export const getPostsController = (req: Request, res: Response) => {
    const posts = db.getPosts();
    res.status(200).json(posts);
}
