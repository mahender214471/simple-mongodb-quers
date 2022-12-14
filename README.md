
# mongodb-querys  

![Logo](https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg)

A [NodeJs](https://nodejs.org/en/docs/) package for make simple and easy [Mongodb](https://www.mongodb.com/docs/) database querys.

- ## Installation

```bash
  npm install mongodb-querys
  yarn add mongodb-querys
```

- ## How to use ?
- #### Import the package 
```js
  const mongodb = require('mongodb-querys');
```
- #### Create schema for your document 
  
```js
  const schema = {
      name:{type:String , required:true},
      email:{type:String , required:true}
  }
  const options = {// mongoose schema optins} ;
  // default options
  // versionKey:false , autoCreate:true , autoIndex:true , timestamps:true
  const userSchema =  mongodb.createSchema(schema , options );

  // Note => This is standard mongoose schema you can write your mongoose middlwares on it like pre or post hooks.
  // userSchema.pre('save', async function (next) {})
  // userSchema.post('save', async function (doc, next) {})
```

- #### Create model for your document 
```js
mongodb.createModel('user' , userSchema);
```


- #### How to use mongodb query ?
```js
// Its contain all the query method
mognodb.querys 
// How to get all  query method of single model
mognodb.querys[yourModelNane]
```

- #### How to create documents in mongodb ?
- ##### `creadeDocs` method
Use for create single or multiple documents.
```js
// For single document
const newDocs = [{
    name:"mahender"
    email:"mahender@mjsofwares.com"
}]
const docData = await mognodb.querys.user.creadeDocs(newDocs)
``` 
```js
// For multiple documents
const newDocs = [
   {
    name:"mahender"
    email:"mahender@mjsofwares.com"
   },
   {
    name:"rinku"
    email:"rinku@mjsofwares.com"
   },
   {
    name:"mukesh"
    email:"mukesh@mjsofwares.com"
   }
]
const docData = await mognodb.querys.user.creadeDocs(newDocs)
```
- ##### `createDocOne` method
Use for create single document. 
```js
const newDocs = {
    name:"mahender"
    email:"mahender@mjsofwares.com"
}
const docData = await mognodb.querys.user.createDocOne(newDocs)
```

- #### How to find documents in mongodb ?
- ##### `finddocs` method
Use for find multiple documents.

```js
 const filter     = {name:"mahender"}  //Filter for serach document in database.
 const projection = {email:1}          // Projection is what field you want from your document.
 const limit      = 10                 // Limit how manny document you want from database
 const skip       = 0                 // Skip how manny documents you want skip
 const sort       = {}                // For short your documents ( ascending or descending order)
 const populate   = {}                // For populate your documents according to your ref field
 // It will return the documents data and matched count of documents for pagination
 const docData    = await mognodb.querys.user.finddocs( filter , projection , limit ,skip ,sort , populate);

```
- ##### `findById` method
Use for find single document.
```js
const id = '857454h5jhvbcnvbc'  // your document id
const projection = {email:1}    // Projection is what field you want from your document.
const docData = await mognodb.querys.user.findById(id , projection);

```

- ##### `findByIdAndUpdate` method
Use for find and update the document.
```js
const id           = "jjjrtjhe48675467856476"
const dataToUpdate = { name:"mahender rajput"}
//It will return the updated data of document.
const docData      = await await mognodb.querys.user.findByIdAndUpdate(id , dataToUpdate);
```
- #### How to count documents in mongodb ?
- ##### `coundDoc` method
```js
const filter = {email:"mahender@mj.com"};
const count  = await await mognodb.querys.coundDoc(filter)
```

- #### How to update documents in mongodb ?
- ##### `updateOne` method
Use for update single document.
```js
 const filter       = { email:"mahender@mj.com"} ;
 const dataToUpdate = {$set:{name:"Mahender Rajput"}} ;
 const docData      = await await mognodb.querys.updateOne(filter , database)
```
- ##### `updateMany` method
Use for update multiple document.
```js
 const filter       = { email:"mahender@mj.com"} ;
 const dataToUpdate = {$set:{name:"Mahender Rajput"}} ;
 // It will update all the matched documents according to the filter and return updated data of the documents
 const docData      = await await mognodb.querys.user.updateMany(filter , database)
```
- #### How to delete documents in mongodb ?
- ##### `softDelete` method
It will update the deletedAt key of all the matched document for softDelete the documents.
```js
const filter = {} ;
const docData      = await await mognodb.querys.user.softDelete(filter)
```
- ##### `hardDeleteOne` method
It will delete single document and return the document data for backup
```js
const filter = {} ;
const docData      = await await mognodb.querys.user.hardDeleteOne(filter)
```
- ##### `hardDelete` method
It will delete all the documents according to filter and return the documents data for backup
```js
const filter = {} ;
const docData      = await await mognodb.querys.user.hardDelete(filter)
```
- #### How to perform aggregate opration in mongodb?
- ##### `aggregate` method
```js
const resultData = await await mognodb.querys.user.aggregate([//.. your aggregate pipeline query ]);
// Note => We will working on make easy aggregate opration
```
- #### How to create and use your own query methods ?
- #### `createCustemMethodsGlobel` method 
Use for create globel methods for all your models
```js
// create own query methods
mongodb.createCustemMethodsGlobel({
  methodName1:(models , querys) => {
      return () => {
           // Your code for perform opration on mongodb
      }
  },
  methodName2:(models , querys) => {
      return () => {
           // Your code for perform opration on mongodb
      }
  }
})
// Use your own method 
//mongodb.querys[modelName].yourMethodName();
Exp 1 => mongodb.querys.user.methodName1()
Exp 2 => mongodb.querys.user.methodName2()

``` 
- #### `createCustemMethods` method 
Use for create methods for single model
```js
// create own query methods
const modelName = 'user'
const methods = {
  methodName1:(models , querys) => {
      return () => {
           // Your code for perform opration on mongodb
      }
  },
  methodName2:(models , querys) => {
      return () => {
           // Your code for perform opration on mongodb
      }
  }
}
mongodb.createCustemMethods( modelName , methods )
// Use your own method 
//mongodb.querys[modelName].yourMethodName();
Exp 1 => mongodb.querys.user.methodName1()
Exp 2 => mongodb.querys.user.methodName2()

``` 
- #### Use express middlwares for get all the querys in your req object.
```js
app.use(mognodb.useMongodb(mongodb));
// Now get all the mongodb querys in your all API endpoint useng req.mognodb

```
- #### Connect the app with mongodb database 
```js
// It will return  promise so use async await or then , catch
await mongodb.connect('mongodb://localhost:27017/test' , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

- #### mongodb functionall methods
| method name | How to use | What does this do |
|-------------|------------|-------------------|
| createSchema | mongodb.createSchema({// your schema config}) | This will create the schema ( document prototype) for your document |
| createModel  | mongodb.createModel(collectionName , collectionSchema) | This will create the model for your document |
|createCustemMethodsGlobel| mongodb.createCustemMethodsGlobel({methodsName:(models , querys) => { return () => { // your code}}})  | You can create your own custem methods which are accessible for all your models for performing some operations on MongoDB |
|createCustemMethods | mongodb.createCustemMethods(modelName , { method1:(model , query) => { return () => { // your code}}}) |You can create your own custem methods which are accessible for a single model  for performing some operations on MongoDB |
|useMongodb | app.use(mongodb.useMongodb(mongodb)) | This will add all the mongodb querys in your all APIS endpoint req object|
|connect | mongodb.connect(mongoURL , options) | This will conect your app to mongodb database|
- #### All querys methods 
 `db = mongodb.querys[modelName];`
| method name | How to use | What does this do |
|-------------|------------|-------------------|
| createDocOne| db.createDocOne(docData) | This will create a single document in your MongoDB collection |
| creadeDocs  | db.creadeDocs([doc1,doc2 , doc3]) | This will create multiple documents in your MongoDB collection |
| finddocs    | db.finddocs(filter , projection , limit , skip , sort , populate) | This will find all the documents in your collection according to the filter and  |
| findById    | db.findById(id , projection) |  This will find one document in your collection according to the id |
| findByIdAndUpdate | db.findByIdAndUpdate(id , dataToUpdate) | This will update the document according to id and return updated data of document |
| coundDoc   | db.coundDoc(filter) | This will count the numbers of documents in your collection |
| updateOne  | db.updateOne(filter , dataToUpdate) | This willl update the first single document matched to the filter |
| updateMany  | db.updateMany(filter , dataToUpdate) | This willl update all the  document matched to the filter |
| softDelete | db.softDelete(filter) | This will soft-delete all the documents matched to the filter |
| hardDeleteOne | db.hardDeleteOne(filter) | This will hard-delete first single document matched to the filter |
| hardDelete | db.hardDelete(filter) | This will hard-delete all the documents matched to the filter |
| aggregate  | db.aggregate([// aggregate pipeline query]) | This will perform aggregate opration on your database |

- #### Quick Start
```js
const express = require("express");
const mongodb = require("mongodb-querys");
const app = express();
const port = process.env.PORT || 4000;
(async () => {
  app.use(express.json({}));
  app.use(express.urlencoded({ extended: true }));
  // Create document schema
  const schema = {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
  }
  const options = {autoCreate:false} ;
  // Default options
 //versionKey:false , autoCreate:true , autoIndex:true , timestamps:true
  const userSchema = mongodb.createSchema(schema , options);
  // Create user model
  mongodb.createModel("user", userSchema);

  // Create connection to mongodb
  await mongodb.connect(
    "mongodb://localhost:27017/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  app.use(mongodb.useMongodb(mongodb));

  app.get("/", (req, res, next) => {
    const { mongodb } = req;
    // Get all models
    const models = mongodb.models;
    // Get all querys
    const querys = mongodb.querys;
    console.log("mogodb conf ============>", mongodb);
    console.log("mongodb models ==========>", models);
    console.log("mongodb querys ===========>", querys);
    return res.send("Welcome on NodeJs , mongodb server APIS");
  });

  app.listen(port, () => console.log(`Lisning at port : -${port}`));
})();

```
- #### How to use it in your API ?
- #### Create user API
```js
app.post('/create-user' ,async (req , res , next) => {
     const { mongodb } = req ;
     const userData = req.body ;
     const newUser = await mongodb.querys.user.createDocOne(userData);
     return res.send(newUser);
     
})
```
- #### Create users API
```js
app.post('/create-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const userData = req.body ;
     const newUser = await mongodb.querys.user.creadeDocs(userData);
     return res.send(newUser);
     
})
```

- #### Get users API
```js
app.get('/get-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter , limit , skip } = req.query;
     const users = await mongodb.querys.user.finddocs(filter , {} , limit , skip , {name:1})
     return res.send(users);
     
})
```
- #### Get user API
```js
app.get('/get-user' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { id } = req.query;
     const user = await mongodb.querys.user.findById(id , {});
     return res.send(user);
     
})
```

- #### Get numbers of users API
```js
app.get('/count-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter } = req.query;
     const user = await mongodb.querys.user.coundDoc(filter);
     return res.send(user);
     
})
```
- #### Update user API
```js
app.put('/update-user' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter , dataToUpdate } = req.body;
     const user = await mongodb.querys.user.updateOne(filter , dataToUpdate);
     return res.send(user);
     
})
```
- #### Update users API
```js
app.put('/update-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter , dataToUpdate } = req.body;
     const user = await mongodb.querys.user.updateMany(filter , dataToUpdate);
     return res.send(user);
     
})
```
- #### Soft delete users API
```js
app.delete('/soft-delete-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter } = req.body;
     const docData      = await await mognodb.querys.user.softDelete(filter)
     return res.send(docData);
     
})
```
- #### Hard delete user API
```js
app.delete('/hard-delete-user' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter } = req.body;
     const docData      = await await mognodb.querys.user.softDelete(filter)
     return res.send(docData);
     
})
```
- #### Hard delete users API
```js
app.delete('/hard-delete-users' ,async (req , res , next) => {
     const { mongodb } = req ;
     const { filter } = req.body;
     const docData      = await await mognodb.querys.user.hardDelete(filter)
     return res.send(docData);
     
})
```
- ## Reference docs
- [Mongodb docs](https://mongoosejs.com/) 
- [Mongoose docs](https://mongoosejs.com/)  
  
- ## Author
  Mahender Rajput 
- ## Let in touch
- [Github](https://github.com/mahender214471)  
- [Linked](https://www.linkedin.com/in/mahender-rajput-9ba900229/) 
  

  