import { config } from "../config/Constansts"
import { NextFunction, Request, response, Response } from "express"
import shortid from "shortid"
import { URLModel } from "../database/models/URL"


export class URLController {
    public async shorten(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {

            res.json(url)
            return
        }
        
        const hash = shortid.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newURL = await URLModel.create({ originURL, hash, shortURL })
        res.json({ newURL })
    }

    public async redirect(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })
        if(url){
            res.redirect(url.originURL)
            return
        }

        res.status(404).json({error: 'URL not found'})
    }
}

