import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';
import * as fs from 'fs';
import { extname } from 'path';
import * as mime from 'mime-types';
import { Request } from 'express';



const allowedExtensions = new Set(['png', 'jpg', 'jpeg'])

export const ImageMulterOption: MulterOptions = {
	limits: {
		fileSize: 5 * 1024 * 1024
	},
	storage: multer.diskStorage({
		destination: (_req, _file, cb) => {
			const path = './uploads'

			// check if the folder exists
			if(!fs.existsSync(path)) {
				// create the folder
				fs.mkdirSync(path, {recursive: true})
			}

			return cb(null, path)
		},
		filename: (_req: Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) => {
			let name = file.originalname.split('.')[0]!

			// if filename length greater than 10, truncate to 10
			if(name.length > 8) {
				name = name.slice(8)
			}

			const fileExtName = extname(file.originalname)
			const randomName = Date.now()

			callback(null, `${name}-${randomName}${fileExtName}`)
		}
	}),
	fileFilter(_req: any, file: {
		fieldname: string;
		originalname: string;
		encoding: string;
		mimetype: string;
		size: number;
		destination: string;
		filename: string;
		path: string;
		buffer: Buffer
	}, callback: (error: (Error | null), acceptFile: boolean) => void) {
		if (!allowedExtensions.has(<string>mime.extension(file.mimetype))) {
			return callback(new Error('Only image files are allowed'), false)
		}

		return callback(null, true)
	}
}