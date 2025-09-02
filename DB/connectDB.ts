import mongoose, { ConnectOptions } from 'mongoose';
interface connectedOptions extends ConnectOptions{
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean,
}       
const options: connectedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
console.log("prprprp",process.env.MONGOUSER)
// connecting to database
const connectDB = async () => {
 /*    const connectionUrl: string = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.e1crf.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority` as string;
    mongoose.connect(connectionUrl )
        .then(() => console.log(`Database connected successfully`))
        .catch((err) => console.log("Getting Error from DB connection" + err.message))
    mongoose.set('strictQuery', false); */

    
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.gpom6d9.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`)
        console.log("connected")
      
        
    } catch (error) {

        console.log(error)
        
    } 
}; 






export default connectDB;   
