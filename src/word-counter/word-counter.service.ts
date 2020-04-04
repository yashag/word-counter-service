import { Readable, Stream } from 'stream';
import fs from 'fs';
import util from 'util';
import request from 'request';
import config from 'config';

import { cleanUpText } from '../utils/text-helpers';

import { WordStatistics } from './word-counter.types';
import { insertWordStatistics } from './word-counter.model';

export const countWordsInTextBody = (req: Readable): Promise<void> => {
    req.setEncoding(config.get('fileParsing.encoding'));

    return handleStreamCount(req, "request");
}

export const countWordsInTextFile = (filepath: string): Promise<void> => {
    const readStream: fs.ReadStream = fs.createReadStream(filepath, {
        encoding: config.get('fileParsing.encoding'),
        highWaterMark: (config.get('fileParsing.streamWaterMark') as number || 64) * 1024
    });

    return handleStreamCount(readStream, filepath);
}

export const countWordsInTextFromURL = (url: string): Promise<void> => {
    const readStream: request.Request = request.get(url, {
        encoding: config.get('fileParsing.encoding'),
        gzip: true
    });

    return handleStreamCount(readStream, url);
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

function handleStreamCount(stream: Stream, origin: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const countPromises: Promise<void>[] = [];
        let chunkCount = 0;

        stream.on('data', (chunk: string) => {
            countPromises.push(countWordsInText(chunk));
            console.info('Processed data chunk number: ', ++chunkCount)
        });

        stream.on('error', reject);

        stream.on('end', () => {
            Promise.all(countPromises).then(() => {
                console.log(`[${new Date().toISOString()}] Finished processing: `, origin);
                resolve();
            }).catch(reject);
        });
    });
}