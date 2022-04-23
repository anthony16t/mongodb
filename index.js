import { MongoClient,ObjectId } from 'mongodb'
import logs from './logs.js'

export default class Mongodb{
    constructor(databaseName='',atlasUrl=''){
        let dbName = databaseName.trim()
        // if database was not given return an error
        if(!dbName || dbName===''){ logs.error('Database name is required') ; return }
        this.dbName = dbName
        this.CLIENT = new MongoClient(atlasUrl!==''?atlasUrl:'mongodb://localhost:27017/')
        this.CONNECTION = false
    }

    // make connection to database
    async connect(){
        let connection = await this.CLIENT.connect()
        this.CONNECTION = connection
        this.DB = this.CLIENT.db(this.dbName)
        return connection
    }

    dropDatabase(){
        // check if connection was made
        if(!this._isConnected('dropDatabase')){ return }
        return this.DB.dropDatabase()
    }

    async listDatabases(){
        // check if connection was made
        if(!this._isConnected('listDatabases')){ return }
        return this.CONNECTION.db(this.dbName).admin().listDatabases()
    }

    listCollections(){
        // check if connection was made
        if(!this._isConnected('listCollections')){ return }
        let db = this.CLIENT.db(this.dbName)
        return db.listCollections().toArray()
    }

    async dropCollection(collectionName){
        // check if connection was made
        if(!this._isConnected('dropCollection')){ return }
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        try{ return await this.DB.collection(collectionName).drop() }
        catch(err){ logs.error(err.message+' ,maybe collection not founded') ; return false }
    }

    async distinct(collectionName,key,filter){
        // check if connection was made
        if(!this._isConnected('distant')){return}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        if(!key){ logs.error('Key name is required') ; return false }
        // try and catch
        try{ return await this.DB.collection(collectionName).distinct(key,filter) }
        catch(err){ logs.error(err.message) ; return false }
    }

    async findOne(collectionName,filter,exclude){
        // check if connection was made
        if(!this._isConnected('findOne')){return}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        exclude = exclude?{projection:exclude}:''
        // try and catch
        try{ return await this.DB.collection(collectionName).findOne(filter,exclude) }
        catch(err){ logs.error(err.message) ; return false }
    }

    deleteOne(collectionName,filter){
        // check if connection was made
        if(!this._isConnected('deleteOne')){return}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).deleteOne(filter) }
        catch(err){ logs.error(err.message) ; return false }
    }

    findOneByObjectId(collectionName,objectId){
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        if(!objectId){ logs.error('ObjectId name is required') ; return false }
        // try and catch
        try{ return this.findOne(collectionName,{_id:ObjectId(objectId)}) }
        catch(err){ logs.error(err.message) ; return false }
    }

    updateOne(collectionName,filter,newDocument,unsetDocument){            
        // check if connection was made
        if(!this._isConnected('deleteOne')){ return }
        const unset = unsetDocument?unsetDocument:{}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).updateOne(filter,{$set:newDocument,$unset:unset}) }
        catch(err){ logs.error(err.message) ; return false }
    }

    insertOne(collectionName,document){
        // check if connection was made
        if(!this._isConnected('insertOne')){ return }
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        if(!document){ logs.error('Document name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).insertOne(document) }
        catch(err){ logs.error(err.message) ; return false }
    }

    findMany(collectionName,filter,exclude){
        // check if connection was made
        if(!this._isConnected('findMany')){ return }
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        exclude = exclude?{projection:exclude}:''
        // try and catch
        try{ 
            const collection = this.DB.collection(collectionName)
            let collectionSize = false
            const length = async()=>  { 
                if(!collectionSize){ collectionSize = await collection.countDocuments() } // get collection size if not set
                return collectionSize
            }
            const toArray = async()=>  { 
                if(!collectionSize){ collectionSize = await collection.countDocuments() } // get collection size if not set
                return collection.find(filter,exclude).batchSize(collectionSize+1).toArray()
            }
            const findCursor = async()=>  { 
                return collection.find(filter,exclude).batchSize(collectionSize+1)
            }
            return { toArray,length,findCursor }
        }
        catch(err){ logs.error(err.message) ; return false }
    }

    // insert multiple documents to collection
    insertMany(collectionName='',documentsArray=[]){
        // check if connection was made
        if(!this._isConnected('insertMany')){ return }
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        if(!documentsArray){ logs.error('DocumentsArray name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).insertMany(documentsArray) }
        catch(err){ logs.error(err.message) ; return false }
    }

    updateMany(collectionName,filter,newDocument,unsetDocument){
        // check if connection was made
        if(!this._isConnected('updateMany')){return}
        const unset = unsetDocument?unsetDocument:{}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).updateMany(filter,{$set:newDocument,$unset:unset}) }
        catch(err){ logs.error(err.message) ; return false }
    }

    deleteMany(collectionName,filter){
        // check if connection was made
        if(!this._isConnected('deleteMany')){return}
        // check if filter was given
        filter = filter?filter:{}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).deleteMany(filter) }
        catch(err){ logs.error(err.message) ; return false }
    }

    aggregate(collectionName,pipeline,options){
        // check if connection was made
        if(!this._isConnected('deleteMany')){return}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName).aggregate(pipeline,options) }
        catch(err){ logs.error(err.message) ; return false }
    }


    collection(collectionName){
        // check if connection was made
        if(!this._isConnected('deleteMany')){return}
        if(!collectionName){ logs.error('Collection name is required') ; return false }
        // try and catch
        try{ return this.DB.collection(collectionName) }
        catch(err){ logs.error(err.message) ; return false }
    }

    database(){ return this.DB }

    close(){ this.CONNECTION.close() }

  
    _isConnected(colName){
        // check if database was connected, if yes return error with a log
        if(!this.CONNECTION){
            logs.error(`Connect to database using db.connect() before using db.${colName}()`)
            return false
        }else{ return true }
    }

}