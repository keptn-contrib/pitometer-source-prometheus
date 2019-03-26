import * as pitometer from 'pitometer';
export declare class Source implements pitometer.ISource {
    private queryUrl;
    constructor({ queryUrl }: {
        queryUrl: any;
    });
    fetch(query: any): Promise<any>;
}
