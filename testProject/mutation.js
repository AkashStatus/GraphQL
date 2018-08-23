var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var app = express();
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://akash:akash1234@ds143511.mlab.com:43511/testpoc');
var schema = buildSchema(`
    type Query {
        getUser: user
    },
    type Mutation {
        updateUser(email: String! first_name: String) : user
        createUser(input: userInput): user
    },
    input userInput {
        first_name: String,
        last_name: String,
        email : String,
        password: String,
        status: String,
        salary: Int,
        department: String
    }
    type user {
        first_name: String,
        last_name: String,
        email : String,
        password: String,
        status: String,
        salary: Int,
        department: String
    }
`);
var getuser = ()=>{
    return new Promise((resolve,reject)=>{
        console.log("inside promise")
        db.collection('users').find().toArray(function(error, userList){      // find() returns a cursor . findOne() works fine
            if (error){
                return reject(error)}
            else if(userList){ 
                return resolve(userList[0])
            } 
            else {
                console.log("some error")
            }
        })
    }).then(data=>data)
}

var updateSingleUser =(args)=>{
    console.log("8888888888888888888888",args.email)
    var emailId =args.email
    return new Promise((resolve,reject)=>{
        console.log("inside promise")
        db.collection('users').findOne({email: emailId},(function(error, userList){
            if (error){
                console.log("11233333333323",error)
                return reject(error)}
            else if(userList){ 
                console.log(")))))))))))))))))",userList)
                userList.first_name=args.first_name
                db.collection('users').save(userList,(err,res)=>{
                    return resolve(userList)
                })
               
            } 
            else {
                console.log("some error")
            }
        }))
    }).then(data=>data)

} 
var createSingleUser = (args)=>{
    console.log("]]]]]]]]]",args)
    return new Promise((resolve,reject)=>{
        var user =args.input
        console.log("vebfdbrwbgmbrgmpbmgmdbmrbmr",user)
        db.collection('users').save(user,(err,res)=>{
            if(err){
                return reject(err) 
            }
            else{
                console.log(res)
                return resolve(res.ops[res.ops.length -1])   // save & insert method return some other info with documents
            }
            
        })

    }).then(data=>data)
}
    
var root = {
        getUser: getuser,
        createUser: createSingleUser,
        updateUser: updateSingleUser,
    };
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4003, () => console.log('Express GraphQL Server Now Running On localhost:400/graphql'));