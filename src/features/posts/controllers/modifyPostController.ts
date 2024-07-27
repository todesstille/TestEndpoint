import {Response, Request} from 'express';
import { db } from '../../../app';
import { validationResult } from 'express-validator';
import { processErrors } from '../../blogs/controllers/helpers/processErrors';

export const modifyPostController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(processErrors(errors));
        return;
    }
    const post = db.findPosts(req.params.id);
    if (post == undefined) {
        res.send(404);
    } else {
        db.modifyPost(req.params.id, req.body);
        res.send(204);
    }
}
