import { selectWordCount } from './word-statistics.model';

export const queryWordCount = (word: string) => {
    return selectWordCount(word);
};