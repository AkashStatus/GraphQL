var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var app = express();
var mongoskin = require('mongoskin');
var request = require('request')
// GraphQL schema
var bodyParser= require('body-parser')
app.use(bodyParser.json())
var mongoose= require('mongoose')
var MongoClient = require('mongodb').MongoClient;

var connectionString = "mongodb://akash:akash1234@ds143511.mlab.com:43511/testpoc"

var db = mongoskin.db('mongodb://akash:akash1234@ds143511.mlab.com:43511/testpoc');

var schema = buildSchema(`
    type Mutation {
        updateUser(email: String! first_name: String) : user
        createUser(input: userInput): user
    }
    type Query {
        getUser : user
        message: appPropert
        name: Int
        abc: appPropert
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
    type appPropert {
        cipher_algo: String
        cipher_key: String
        s3_accessKeyId: String
        s3_secretAccessKey: String
        s3_bucketName: String
        main_css_file_url: String
        main_css_file_path: String
        default_cover_images: String
        feedback_group_email: String
        visit_us_url : String
        }
`);
var getname = ()=>{
    return 'Hi'
}
var  callAnotherApi = ()=>{
    console.log("aaaaaaaaaaaaa")
    var headers = {
        'Content-Type': 'application/json'
    }
        var options = {
            url: "http://localhost:3007/graphql"+"?query={appProperty{s3_accessKeyId s3_secretAccessKey}}",
            method: 'GET',
            headers: headers,
        }
        return new Promise((resolve,reject)=>{
            request(options,(error,response,body)=>{
                console.log("bbbbbbbbbbbbbbb")
                if(error){
                    console.log("ccccccccccccccc")
                    return reject(error)
                }
                else {
                    console.log("dddddddddddddd",body)
                    var body =JSON.parse(body)
                    console.log("eeeeeeeeeeeeee",body)
                    return resolve(body.data.appProperty)
                }
    
            })
        }).then(data=>data)
}
var getuser = ()=>{
    console.log("55555555555555")
    return new Promise((resolve,reject)=>{
        console.log("inside promise")
        db.collection('users').find().toArray(function(error, userList){      // find() returns a cursor . findOne() works fine
            if (error){
                console.log("11233333333323",error)
                return reject(error)}
            else if(userList){ 
             console.log("3453536366457646")
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
    createUser: createSingleUser,
    updateUser: updateSingleUser,
    getUser: getuser,
    message: getname,
    name: () => 5,
    abc: callAnotherApi,
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(8000, () => console.log('Express GraphQL Server Now Running On localhost:8000/graphql'));