import { Readable } from 'stream';
import fs from 'fs';
import config from 'config';

import { cleanUpText } from '../utils/text-helpers';

import { WordStatistics } from './word-counter.types';
import { insertWordStatistics } from './word-counter.model';


export const countWordsInTextBody = (req: Readable): Promise<undefined> => {
    req.setEncoding('utf8');

    return handleStreamCount(req);
}

export const countWordsInTextFile = (filepath: string): Promise<undefined> => {
    const readStream: fs.ReadStream = fs.createReadStream(filepath, {
        encoding: 'utf8',
        highWaterMark: (config.get('fileParsing.streamWaterMark') as number || 64) * 1024
    });

    return handleStreamCount(readStream);
}

function handleStreamCount(stream: Readable): Promise<undefined> {
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk: string) => {
            countWordsInText(chunk);
        });

        stream.on('error', reject);

        stream.on('end', () => {
            resolve();
        });
    });
}

function countWordsInText(text: string): Promise<undefined> {
    const cleanedUpText: string = cleanUpText(text);

    const calculatedStatistics: WordStatistics = cleanedUpText
        .split(";")
        .reduce((accumulator: { [key: string]: number; }, word: string) => {
            accumulator[word] = (accumulator[word] || 0) + 1;
            return accumulator;
        }, {});

    return insertWordStatistics(calculatedStatistics);
};