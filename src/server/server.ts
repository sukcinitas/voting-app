/* eslint-disable no-console */
import * as passport from 'passport';
import * as express from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as session from 'express-session';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as path from 'path';
import * as connectMongo from 'connect-mongo';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';
import userRouter from './routes/user.route';
import pollRouter from './routes/poll.route';

dotenv.config();
const MongoStore = connectMongo(session);

(async () => {
  try {
    // mongoose.Promise = global.Promise;
    mongoose.set('useFindAndModify', false);

    const app = express();
    app.use(
      session({
        name: process.env.SESS_NAME,
        secret: process.env.SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: 'session',
          ttl: 60 * 60,
          autoRemove: 'native',
        }),
        cookie: {
          sameSite: false,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 86400000,
          httpOnly: true,
        },
        unset: 'destroy',
      }),
    );

    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    app.use(express.json()); // instead of bodyParser, since 4.16 Express; extended
    app.set('trust proxy', 1);
    app.use(passport.initialize());
    app.use(passport.session());

    if (process.env.NODE_ENV === 'development') {
      const corsOptions = {
        credentials: true,
        origin: 'http://localhost:3000',
      };
      app.use(cors(corsOptions));
    }

    app.use(express.static('dist'));

    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    app.use (function (req, res, next) {
      if (process.env.NODE_ENV !== 'production' ) {
        next();
        return;
      }
      if (req.secure) {
        next();
      } else {
        res.redirect('https://' + req.headers.host + req.url);
      }
    });

    const { connection } = mongoose;
    connection.once('open', () => {
      console.log('Connection with MongoDB database established');
    });

    app.use('/api/polls', pollRouter);
    app.use('/api/user', userRouter);

    app.all('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), '/dist/index.html'), (err) => {
        if (err) {
          res.status(500).send(err);
        }
      });
    });
    app.use((err: Error, req: Request, res: Response) => {
      console.error(err.stack);
      res.status(500).end();
    });
    app.listen(process.env.PORT || 8080, () => {
      console.log('App is running!');
    });
  } catch (err) {
    console.error(err);
  }
})();
