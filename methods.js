const moment = require("moment");

const GenerateMethods = (Model) => {
  try {
    const methods = {};
    // ! Create documents
    methods.createDocOne = async ( document ) => {
       const docToSave = { ...document , createdAt:moment().valueOf() , updatedAt:moment().valueOf() }
       const newDoc = new Model(docToSave);
       return await newDoc.save();
    }
    methods.creadeDocs = async (documents) => {
      try {
        if (!Array.isArray(documents)) {
          throw {
            Error: "Documents create failed",
            message: "Documents should we an array",
          };
        }
        for (let i = 0; i < documents.length; i++) {
          if (typeof documents[i] != "object") {
            throw {
              Error: "Documents create failed",
              message: "Each document in array should we an object",
            };
          } else {
            documents[i].createdAt = moment().valueOf();
            documents[i].updatedAt = moment().valueOf();
          }
        }
        const result = await Model.create(documents);
        return result;
      } catch (err) {
        console.log(err);
        throw err;
      }
    };
    // !Find documents
    methods.finddocs = async (
      filter,
      projection,
      limit,
      skip,
      sort,
      populate
    ) => {
      const data =  await Model.find(filter, projection)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate(populate);
        const count = await methods.coundDoc(filter) ;
        return {
           data , count
        }
    };
    methods.coundDoc = async (filter) => {
         return await Model.find(filter).count()
    }
    methods.findById = async (id, projection) => {
      return await Model.findById(id, projection);
    };
    methods.findByIdAndUpdate = async (id, dataToUpdate) => {
      await Model.findByIdAndUpdate(id, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
      return  await methods.findById(id);
    };
    // ! Updates documents
    methods.updateOne = async (filter, dataToUpdate) => {
      await Model.updateOne(filter, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
      const updatedData =  await Model.find(filter);
      return { message:"Document updated succesfully" , data:updatedData[0]}
    };
    methods.updateMany = async (filter, dataToUpdate) => {
      await Model.updateMany(filter, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
      const updatedData =  await methods.finddocs(filter);
      return { message:"Documents updated succesfully" , ...updatedData}
    };
    // ! Delete documets
    methods.softDelete = async (filter) => {
      await methods.updateMany(filter, { deletedAt: true });
      const deletedData = await methods.finddocs(filter);
      return {message:"Documents soft deleted succesfully" , ...deletedData};
    };
    methods.hardDeleteOne = async (filter) => {
      const docData = await Model.find(filter);
      if(!docData[0]){
         return { message:"Document not found" , data:{}}
      }
      await Model.deleteOne(filter);
      return { message:"Document deleted succesfully" , data:docData[0]}
    };
    methods.hardDelete = async (filter) => {
      const docData = await methods.finddocs(filter);
      if(!docData.data[0]){
         return { message:"Documents not found" , ...docData}
      }
      await Model.deleteMany(filter);
      return { message:"Documents deleted succesfully" , ...docData}
    };
    // ! Advance methods
    methods.aggregate = async (aggregateQuery) => {
        return await Model.aggregate(aggregateQuery);
    };
    return methods;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
module.exports = GenerateMethods;
