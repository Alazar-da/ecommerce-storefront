import mongoose, { ConnectOptions } from 'mongoose';
interface connectedOptions extends ConnectOptions{
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean,
}       
const options: connectedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
let isConnected = false;

// connecting to database
const connectDB = async () => {
     if (isConnected) return;
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.bta9ljk.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority`)
          isConnected = true;
   console.log("✅ MongoDB Connected:", mongoose.connection.host);
      
        
    } catch (error) {

           console.error("❌ MongoDB Connection Error:", error);
    throw error;

    }
};






export default connectDB;   
