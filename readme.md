# Mongodb
### Made to be fast and simple to use

Start using the package by importing it.
``` javascript
import Mongodb from "@anthony16t/mongodb";
// or using require
const Mongodb = require('@anthony16t/mongodb')
```
### Initialize package
``` javascript
// use connectionUrl or keep it empty to use localhost
const db = new Mongodb('DatabaseName','connectionUrl')
```
### Connect to database
Inside a async function
``` javascript
async function Main(){
    // make sure to await this, it will take sometime to connect
    await db.connect()
    
    // fetch data from collection
    const collectionFilter = {name:'anthony'}
    const userOne = await db.findOne('CollectionName',collectionFilter).toArray()
    
    // get many users (results) from collection
    const users = await db.findMany('CollectionName',collectionFilter).toArray()
    
    // insert new user
    await db.insertOne('CollectionName',{name:'newUserName'})
    
    // insert multiple new users
    const users = [{name:'newUserName'},{name:'newUserName2'}]
    await db.insertMany('CollectionName',users)

    // delete one user
    await db.deleteOne('CollectionName',{name:'newUserName2'})

    // delete multiple users
    await db.deleteMany('CollectionName',{name:'anthony'})
}
// run Main function
Main()
```