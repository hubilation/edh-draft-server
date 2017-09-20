import {MongoClient} from "mongodb";

export function testConnection(){
    MongoClient.connect("mongodb://165.227.24.220:27017/local", function(err,db){
        if(!err){
            console.log("We connected!");
        }
    });
}