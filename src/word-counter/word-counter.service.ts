import { Readable, Stream } from 'stream';
import fs from 'fs';
import util from 'util';
import request from 'request';
import config from 'config';

import { cleanUpText } from '../utils/text-helpers';

import { WordStatistics } from './word-counter.types';
import { insertWordStatistics } from './word-counter.model';

export const countWordsInTextBody = (req: Readable): Promise<void> => {
    req.setEncoding('utf8');

    return handleStreamCount(req);
}

export const countWordsInTextFile = (filepath: string): Promise<void> => {
    const readStream: fs.ReadStream = fs.createReadStream(filepath, {
        encoding: 'utf8',
        highWaterMark: (config.get('fileParsing.streamWaterMark') as number || 64) * 1024
    });

    return handleStreamCount(readStream);
}

export const countWordsInTextFromURL = (url: string): Promise<void> => {
    const readStream: request.Request = request.get(url, { encoding: 'utf8' });

    return handleStreamCount(readStream);
}

export function countWordsInText(text: string): Promise<void> {
    const cleanedUpText: string = cleanUpText(text);

    const calculatedStatistics: WordStatistics = cleanedUpText
        .split(";")
        .reduce((accumulator: { [key: string]: number; }, word: string) => {
            accumulator[word] = (accumulator[word] || 0) + 1;
            return accumulator;
        }, {});

    return insertWordStatistics(calculatedStatistics);
};

function handleStreamCount(stream: Stream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const countPromises: Promise<void>[] = [];

        stream.on('data', (chunk: string) => {
            countPromises.push(countWordsInText(chunk));
        });

        stream.on('error', reject);

        stream.on('end', () => {
            Promise.all(countPromises).then(() => {
                resolve();
            }).catch(reject);
        });
    });
}