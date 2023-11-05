import mongoose from "mongoose";
import 'dotenv/config';

const mongoConnect = () => {
    mongoose.connect(process.env.DATABASE, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    mongoose.connection
        .once('open', () => console.log('Database connected successful'))
        .on('error', (err) => console.log(err));
}

export default mongoConnect;
