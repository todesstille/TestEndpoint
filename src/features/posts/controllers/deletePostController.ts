import {Response, Request} from 'express';
import { db } from '../../../app';

export const deletePostController = async (req: Request, res: Response) => {
    const blog = await db.findPosts(req.params.id);
    if (blog == undefined) {
        res.send(404);
    } else {
        await db.deletePost(req.params.id);
        res.send(204);
    }
}