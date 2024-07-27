import {Response, Request} from 'express';
import { db } from '../../../app';

export const findPostController = (req: Request, res: Response) => {
    const post = db.findPosts(req.params.id);
    if (post == undefined) {
        res.send(404);
    } else {
        res.status(200).send(post);
    }
}