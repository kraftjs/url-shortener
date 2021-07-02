import {NextFunction, Request, Response} from "express";

// import recordService

class RecordController {
    async createRecord(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err)
        }
    }

    async readRecords(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (err) {
            next(err)
        }
    }

    async readRecord(req: Request, res: Response, next: NextFunction) {
        const {hash} = req.params;
        try {

        } catch (err) {
            next(err)
        }
    }

    async updateRecord(req: Request, res: Response, next: NextFunction) {
        const {hash} = req.params;
        try {

        } catch (err) {
            next(err)
        }
    }

    async deleteRecord(req: Request, res: Response, next: NextFunction) {
        const {hash} = req.params;
        try {

        } catch (err) {
            next(err)
        }
    }
}

export default new RecordController();