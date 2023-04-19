import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import errorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';

class App {
    public express:Application
    public port: number
    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware():void{
        this.express.use(cors());
        this.express.use(compression());
        this.express.use(helmet());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private initialiseControllers(controllers: Controller[]):void{
        controllers.forEach((controller:Controller) => {
            this.express.use('/api', controller.router);
            });
    }

    private initialiseErrorHandling():void{
        this.express.use(errorMiddleware);
    }

    private initialiseDatabaseConnection():void{
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    }

    public listen():void{
        this.express.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
            });
    }
}

export default App;