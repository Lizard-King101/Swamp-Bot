import { Express, Request, Response } from "express";

export class GetInclude {
    GET: any = {};
    urlArr: string[] = [];
    constructor(req: Request, res: Response, app: Express) {
        
        this.urlArr = req.originalUrl.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
        if(req.originalUrl.split('?').length > 1){
            req.originalUrl.split('?')[1].split('&').forEach((keyVal: any)=>{
                let splitKey: any = keyVal.split('=');
                this.GET[splitKey[0]] = !isNaN(splitKey[1]) ? Number(splitKey[1]) : decodeURI(splitKey[1]);
            });
        }

    }

    request = (): Promise<RequestResponse> => {
        return new Promise((res, rej) => {
            rej('cant get default import');
        });
    };

    after_get = (): void => {};
}

export interface RequestResponse {
    continue: boolean;
    message: string;
}