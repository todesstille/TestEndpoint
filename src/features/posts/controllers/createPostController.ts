import {Response, Request} from 'express';
import { db } from '../../../app';
import { validationResult } from 'express-validator';
import { processErrors } from '../../blogs/controllers/helpers/processErrors';

export const createPostController = (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(processErrors(errors));
        return;
    }
    const newPost = db.createPost(req.body);
    res.status(201).json(newPost);
}