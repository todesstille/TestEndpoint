import {Response, Request} from 'express';
import { db } from '../../../app';

export const deleteDbController = (req: Request, res: Response) => {
    db.clearDB();
    res.send(204);
}