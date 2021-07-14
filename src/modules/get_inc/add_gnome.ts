import { GetInclude, RequestResponse } from "../../types/get_include";
import { Express, Request, Response } from "express";
import { DataBase } from "../database";
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const EXTENSIONS = [
    'jpg',
    'jpeg',
    'png'
]

export default class extends GetInclude{
    db: DataBase;
    constructor(req: Request, res: Response, app: Express) {
        super(req, res, app);
        this.db = new DataBase();
    }

    request = (): Promise<RequestResponse> => {
        return new Promise(async (res, rej) => {
            if(this.GET['image']) {
                let id = Math.random().toString(36).substr(2, 9);
                let file_dir = path.join(global.paths.root, 'public', 'gnome');
                let extArr = this.GET['image'].split('.');
                let file_ext = extArr.pop();
                console.log('EXT: ', file_ext);
                
                if(file_ext == '' || extArr.length < 2) {
                    rej('Invalid image url');
                    return;
                }
                if(EXTENSIONS.indexOf(file_ext) == -1) {
                    rej('Invalid image type');
                    return;
                }
                let image_name = id + '.' + file_ext;
                let file_path = path.join(file_dir, image_name);
                const writer = fs.createWriteStream(file_path);

                const response = await axios({url: this.GET['image'], method: 'GET', responseType: 'stream'}).catch((err) => {
                    console.log(err);
                    rej(err);
                });

                if(!response) {
                    rej('No axios response');
                    return;
                }

                response.data.pipe(writer);

                this.db.insert('gnome_images', {
                    id,
                    url: 'gnome/'+image_name
                });

                res({continue: false, message: 'Gnome added successfully.'});
            } else {
                rej('missing image');
            }
        });
    }
}