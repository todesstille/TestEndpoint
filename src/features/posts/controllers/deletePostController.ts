import {Response, Request} from 'express';
import { db } from '../../../app';

export const deletePostController = (req: Request, res: Response) => {
    const blog = db.findPosts(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        db.deletePost(req.params.id);
        res.send(204);
    }
}