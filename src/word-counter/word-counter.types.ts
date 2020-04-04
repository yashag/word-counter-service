export type WordStatistics = {
    [key: string]: number;
}

export type TextReadMethodToFunction = {
    [key: string]: (address: string) => Promise<void>
}