import { Express, Request, Response } from 'express';
import { DataBase } from './database';
import { Resource } from './resource';
import path from 'path';

import fs from 'fs';

const mime: any = {
    'js': 'application/javascript',
    'map': 'application/octet-stream'
}

export class GET {
    db: DataBase;
    resource: Resource;

    constructor(private app: Express) {
        this.db = new DataBase();
        this.resource = new Resource();
        this.app.get("*", (req: Request, res: Response) => {
            this.proccess(req, res);
        })
    }

    async proccess(req: Request, res: Response) {
        // split the request domain
        if(req && res) {
            // var domain = req.get('host').split(':')[0];
    
            // split url into array eg: domain.com/account/settings -> ["account", "settings"] 
            var urlArr = req.originalUrl.split('?')[0].replace(/^\/+|\/+$/g, '').split('/');
            // parse get peramiters
            var GET: any = false;
            if(req.originalUrl.split('?').length > 1){
                GET = {};
                req.originalUrl.split('?')[1].split('&').forEach((keyVal: any)=>{
                    let splitKey: any = keyVal.split('=');
                    GET[splitKey[0]] = !isNaN(splitKey[1]) ? Number(splitKey[1]) : decodeURI(splitKey[1]);
                });
            }
    
            // http or https
            var protocol = req.protocol;
            // load clinet details
    
            // res.send('ok');

            console.log({
                urlArr,
                GET,
                protocol
            })

            if(this.resource.isResource(urlArr)){
                let options: any = false;
                let lastUrl = urlArr[urlArr.length - 1];
                let fileExt: string = lastUrl.split('.').pop() + '';
                if(Object.keys(mime).indexOf(fileExt) > -1){
                    options = {type: mime[fileExt]};
                }
                
                if (urlArr[0].match(/^[_]+[a-z]+/gm)) {
                    
                    this.resource.send(res, path.join(global.paths.root, 'public', urlArr[0].substr(1), urlArr.slice(1).join('/')), options);
                } else {
                    
                    this.resource.send(res, path.join(global.paths.root, 'www', urlArr.join('/')), options);
                }
            } else {
                this.resource.send(res, path.join(global.paths.root, 'www/index.html'));
            }
        }
    }
}