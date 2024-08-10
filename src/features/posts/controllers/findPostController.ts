import {Response, Request} from 'express';
import { db } from '../../../app';

export const findPostController = async (req: Request, res: Response) => {
    const post = await db.findPosts(req.params.id);
    if (post == undefined) {
        res.send(404);
    } else {
        await res.status(200).send(post);
    }
}