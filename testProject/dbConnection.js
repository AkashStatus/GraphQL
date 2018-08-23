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
    var root = {
        getUser: getuser
    };
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4002, () => console.log('Express GraphQL Server Now Running On localhost:4002/graphql'));