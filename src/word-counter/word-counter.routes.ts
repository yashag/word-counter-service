import { Request, Response, NextFunction } from 'express';

import {countWordsInText, countWordsInTextFile} from './word-counter.service';

export const postWordCount = async (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.get('Content-Type');

    if(req.is('text/plain')) {
        countWordsInText(req.body)
        res.sendStatus(200);
    } else if(req.is('application/json') && (req.body.filepath || req.body.url)) {
        console.log(">>>>>>> Request content type: ", contentType);
        await countWordsInTextFile(req.body);
    } else {
        res.status(400);
        next(new Error("An unsupported Content-Type was provided"));
    }
};