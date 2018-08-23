var mongoskin = require('mongoskin');
var MongoClient = mongoskin;
var mongodb = require('mongodb');
// mongodb.MongoClient.connect('mongodb://akash:akash1234@ds143511.mlab.com:43511/testpoc',function(err,db){
// db.collection('users').find().toArray(function(err,user){
//     if(err){
//         console.log("error",err)
//     }
//     else if(user){
//         console.log("542662456456")
//         console.log(user)
//     }
//     else console.log("222222222")
// })
// });
var db = mongoskin.db('mongodb://akash:akash1234@ds143511.mlab.com:43511/testpoc');
db.collection('users').find().toArray(function(error, userList){
    if (error) console.log("11233333333323",error)
    if(userList){ 
    var count =1
    userList.forEach((user)=>{
        console.log("user " + count + " is", user)
        count++
    })}
})