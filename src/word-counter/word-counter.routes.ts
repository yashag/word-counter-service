import { Request, Response, NextFunction } from 'express';

import { countWordsInTextBody, countWordsInTextFile, countWordsInTextFromURL } from './word-counter.service';

export const postWordCount = async (req: Request, res: Response, next: NextFunction) => {
    const asyncMode = req.query?.async === 'false' ? false : true;

    if (req.is('text/plain')) {
        asyncMode ? countWordsInTextBody(req) : await countWordsInTextBody(req);
        res.sendStatus(200);
    } else if (req.is('application/json')) {

        if (req.body.filepath) {
            try {
                asyncMode ? countWordsInTextFile(req.body.filepath) : await countWordsInTextFile(req.body.filepath);
                res.sendStatus(200);
            } catch (error) {
                next(error);
            }
        } else if (req.body.url) {
            try {
                asyncMode ? countWordsInTextFromURL(req.body.url) : await countWordsInTextFromURL(req.body.url);
                res.sendStatus(200);
            } catch (error) {
                next(error);
            }
        } else {
            res.status(400).send("Could not find valid properties in the body. Was expecting either a 'filepath' or a 'url'");
        }

    } else {
        res.status(400).send("An unsupported Content-Type was provided");
    }
};