import { Request, Response, NextFunction } from 'express';

import { countWordsInTextBody, countWordsInTextFile, countWordsInTextFromURL } from './word-counter.service';
import { TextReadMethodToFunction } from './word-counter.types';

const methodToFunction: TextReadMethodToFunction = {
    filepath: countWordsInTextFile,
    url: countWordsInTextFromURL
};

export const postWordCount = async (req: Request, res: Response, next: NextFunction) => {
    const asyncMode = req.query?.async === 'false' ? false : true;

    if (req.is('text/plain')) {
        asyncMode ? countWordsInTextBody(req) : await countWordsInTextBody(req);
        res.sendStatus(200);
    } else if (req.is('application/json')) {

        const inputType = (req.body.filepath && "filepath") || (req.body.url && "url");

        if(!inputType) {
            res.status(400).send("Could not find valid properties in the body. Was expecting either a 'filepath' or a 'url'");
            return;
        }

        try {
            if(asyncMode) {
                methodToFunction[inputType](req.body[inputType]);
            } else {
                await methodToFunction[inputType](req.body[inputType]);
            }
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }

    } else {
        res.status(400).send("An unsupported Content-Type was provided");
    }
};