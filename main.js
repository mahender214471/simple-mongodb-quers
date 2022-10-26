const moment   = require('moment');
const mpngoose = require('mongoose');
const GenerateMethods = require('./methods');

//! CLASS FOR MANAGE MONGODB QUERYS
class momgodb {
    constructor () {
         this.schemas = {} ;
         this.models  = {} ;
         this.querys  = {} ;
    }
    async connect ( URL , options ) {
          try{
              await mongoose.connect(URL , options) ;
              // ! Generate custem methods 
              console.log('enerating mengodb querys ....');
              Object.entries(models).forEach( async( key , value ) => {
                   const dbMethods = GenerateMethods(value);
                   this.querys[key] = dbMethods ;
              })
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
             cretedAt:{type:Number , default:moment().valueOf()},
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
}

module.exports = momgodb ;