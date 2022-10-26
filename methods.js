const moment = require("moment");

const GenerateMethods = (Model) => {
  try {
    const methods = {};
    // ! Create documents
    methods.creadeDoc = async (documents) => {
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
            documents[i].cretedAt = moment().valueOf();
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
      return await Model.find(filter, projection)
        .limit(limit)
        .skip(skip)
        .sort(sort)
        .populate(populate);
    };
    methods.findById = async (id, projection) => {
      return await Model.findById(id, projection);
    };
    methods.findByIdAndUpdate = async (id, dataToUpdate) => {
      return await Model.findByIdAndUpdate(id, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
    };
    // ! Updates documents
    methods.updateOne = async (filter, dataToUpdate) => {
      await Model.updateOne(filter, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
      return await methods.finddocs(filter);
    };
    methods.updateMany = async (filter, dataToUpdate) => {
      await Model.updateMany(filter, {
        ...dataToUpdate,
        updatedAt: moment().valueOf(),
      });
      return await methods.finddocs(filter);
    };
    // ! Delete documets
    methods.softDelete = async (filter) => {
      await methods.updateMany(filter, { deletedAt: true });
      return true;
    };
    methods.hardDeleteOne = async (filter) => {
      return await Model.deleteOne(filter);
    };
    methods.hardDelete = async (filter) => {
      return await Model.remove(filter);
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
