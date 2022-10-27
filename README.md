
# mongodb-querys  ![Logo](https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg)

A [NodeJs](https://nodejs.org/en/docs/) package for make simple and easy [Mongodb](https://www.mongodb.com/docs/) database querys.



- ## Installation

```bash
  npm install mongodb-querys
  yarn add mongodb-querys
```

- ## How to use ?
- #### Import the package 
```
  const mongodb = require('mongodb-querys');
```
- #### Create schema for your document 
  
```
  const userSchema =  mongodb.createSchema({
      name:{type:String , required:true},
      email:{type:String , required:true}
  });

  // Note => This is standard mongoose schema you can write your mongoose middlwares on it like pre or post hooks.
  // userSchema.pre('save', async function (next) {})
  // userSchema.post('save', async function (doc, next) {})
```

- #### Create model for your document 
```
mongodb.createModel('user' , userSchema);
```

- #### Connect the app with mongodb database 
```
// It will return  promise so use async await or then , catch
await mongodb.connect('mongodb://localhost:27017/test' , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```
- #### How to use mongodb query ?
```
// Its contain all the query method
mognodb.querys 
// How to get all  query method of single model
mognodb.querys[yourModelNane]
```

- #### How to create documents in mongodb ?
```
// For single document
const newDocs = [{
    name:"mahender"
    email:"mahender@mjsofwares.com"
}]
const docData = await mognodb.querys.user.creadeDocs(newDocs)
``` 
```
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

- #### How to find documents in mongodb ?
- ##### finddocs method

```
 const filter     = {name:"mahender"}  //Filter for serach document in database.
 const projection = {email:1}  // projection is what filed you want from your document
 const limit      = 10  // Limit how manny document you want from database
 const skip       = 0   // Skip how manny documents you want skip
 const sort       = {}  // For short your documents ( assending or decenting order)
 const populate   = {}  // For populate your documents according to your ref id
 const docData    = await mognodb.querys.user.finddocs( filter , projection , limit ,skip ,sort , populate);

```
- ##### findById method
```
```
- ## Refrance docs
- [Mongoose docs](https://mongoosejs.com/)  
- [Mongodb docs](https://mongoosejs.com/)  




    