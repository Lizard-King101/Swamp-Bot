import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const resources = [
    "js", 
    "png", 
    "jpeg",
    "jpg",
    "gif",
    "ico",
    "svg",
    "css",
    "map",
    "ttf",
    "woff",
    "woff2",
    "mp4",
    "webm"
]

export class Resource {
    constructor() {

    }

    public isResource(urlArr: Array<string>): boolean{
        // if last element of array ends with a resource file extension
        return resources.indexOf( urlArr[urlArr.length - 1].split('.').pop() + '' ) > -1;
    }
    
    public get(res: Response, dir: string, urlArr: string[]){
        this.send(res, path.join(dir, 'resources', urlArr.join('/')) );
    }
    
    public send(res: Response, resourcePath: string, options: any | false = false){
        // determin if file exsist
        if (options) {
            if (options.type) {
                res.set('Content-Type', options.type);
            }
        }
        fs.access(decodeURI(resourcePath), (<any>fs).F_OK, (err)=>{
            if(err){
                // resolve the request with a 404
                
                res.status(404).send('Not found');
            }else{
                // stream file to user
    
                fs.createReadStream(decodeURI(resourcePath)).pipe(res);
            }
        })
    }
}