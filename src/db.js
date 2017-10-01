import mongoose from "mongoose";

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://192.241.217.70/draft", {useMongoClient: true}, function(){
    console.log("mongo connected");
});

export default mongoose.connection;