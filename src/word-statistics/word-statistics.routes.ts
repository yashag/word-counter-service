import { Request, Response, NextFunction } from 'express';

import { queryWordCount } from './word-statistics.service';

export const getWordStatistics = async (req: Request, res: Response, next: NextFunction) => {
    const { word } = req.query;

    if (!word) {
        res.sendStatus(400);
    } else {
        try {
            const counter: number = await queryWordCount(word);
            res.status(200).send(counter.toString());
        } catch(error) {
            res.sendStatus(500);
        }
    }
};