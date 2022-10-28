const moment   = require('moment');
const mongoose = require('mongoose');
const GenerateMethods = require('./methods');

//! CLASS FOR MANAGE MONGODB QUERYS
class momgodb {
    constructor () {
         this.schemas       = {} ;
         this.models        = {} ;
         this.querys        = {} ;
         this.custemMethods = [];
    }
    async connect ( URL , options ) {
          try{
              await mongoose.connect(URL , options) ;
              // ! Generate custem methods 
              console.log('Generating mengodb querys ....');
              Object.entries( this.models ).forEach( async([key, value]) => {
                   const methods = await GenerateMethods(value);
                   this.querys[key] = methods ;
              });
              // ! GENERATING CUSTEM METHODS
              for (let i = 0; i < this.custemMethods.length; i++) {
                const methds = this.custemMethods[i];
                Object.entries( methds ).forEach( async([methodName, methodFunction]) => {
                    Object.entries( this.models ).forEach( async([ModelKey, Model]) => {
                        const methods = await methodFunction(Model , this.querys);
                        this.querys[ModelKey][methodName] = methods ;
                   });
               });
              }
              // ! Print succesfully connection message
              console.log(`App successfully connect with mongodb : - ${URL}`);
          }
          catch(err){
             console.log(err);
             throw new Error(err);
          }
    }
    
    createSchema ( schema ) {
          const docSchema = new mongoose.Schema({
             createdAt:{type:Number , default:moment().valueOf()},
             updatedAt:{type:Number , default:moment().valueOf()},
             ...schema,
             deletedAt:{type:Boolean , default:false}
          } , { versionKey:false , autoCreate:true , autoIndex:true , timestamps:true})
          return docSchema ;
    }

    createModel ( collectionName , collectionSchema ) {
         const model = mongoose.model( collectionName , collectionSchema ) ;
         this.models[collectionName] = model ;
         this.schemas[collectionName] = collectionSchema ;
    }

    async createCustemMethods (object) {
        try{
            console.log('custem methods ==========>' , object)
            Object.entries( this.models ).forEach( async([key, value]) => {
                if(object[key] === key ) {
                     throw { Error:`Custem method name ${key} not allow use diffrent`}
                }
           });
           this.custemMethods.push(object);
        } 
        catch(err){
            console .log('Error in generate custem db methods')
            console.log(err);
            throw new Error(err);
        }
    }
    useMongodb ( req , res , next ) {
         try{
            const schemas = this.schemas;
            const models  = this.models ;
            const querys  = this.querys; 
            req.mongodb   =   { schemas , models , querys };
            next();
         }
         catch(err){
            console.log('Error in enable mongodb quers in req ' , err );
            next(err);
         }
    }
}

module.exports = momgodb ;