const moment = require("moment");
const mongoose = require("mongoose");
const Joi = require("joi");
const GenerateMethods = require("./methods");

//! CLASS FOR MANAGE MONGODB QUERYS
class mongodb {
  constructor() {
    this.schemas = {};
    this.models = {};
    this.querys = {};
    this.custemMethodsGlobel = [];
    this.custemMethods = {};
  }
  async connect(URL, options) {
    try {
      await mongoose.connect(URL, options);
      // ! Generate custem methods
      console.log("Generating mongodb querys ....");
      const AllModels = Object.entries(this.models);
      for (let i = 0; i < AllModels.length; i++) {
        const [modelName, value] = AllModels[i];
        const methods = await GenerateMethods(value);
        this.querys[modelName] = methods;
      }

      // ! GENERATING CUSTEM METHODS GLOBELS
      for (let i = 0; i < this.custemMethodsGlobel.length; i++) {
        const userMethods = this.custemMethodsGlobel[i];
        const methods = Object.entries(userMethods);
        for (let a = 0; a < methods.length; a++) {
          const [methodName, methodFunction] = methods[a];
          const dnQuerys = Object.entries(this.querys);
          for (let b = 0; b < dnQuerys.length; b++) {
            const [modelName, modelQuerys] = dnQuerys[b];
            if (this.querys[modelName][methodName]) {
              throw {
                message: `Method name '${methodName}' allready exist use diffrent name`,
              };
            }
            const methodData = await methodFunction(this.models, this.querys);
            if (!methodData) {
              throw {
                message: `Invailed globel method configuration method does not return any value or function`,
              };
            }
            this.querys[modelName][methodName] = methodData;
          }
        }
      }

      //! GENERATING CUSTEM METHODS ON SINGLE MODEL
      const custemMethods = Object.entries(this.custemMethods);
      for (let i = 0; i < custemMethods.length; i++) {
        const [modelName, methods] = custemMethods[i];
        const userWritedMethods = Object.entries(methods);
        for (let i = 0; i < userWritedMethods.length; i++) {
          const [userMethodName, UserMethodFunction] = userWritedMethods[i];
          if (this.querys[modelName][userMethodName]) {
            throw {
              message: `Method name '${userMethodName}' allready exist use diffrent name`,
            };
          }
          const userCustemMethod = await UserMethodFunction(
            this.models[modelName],
            this.querys[modelName]
          );
          if (!userCustemMethod) {
            throw {
              message: `Invailed custem methods configuration method does not return any value or function`,
            };
          }
          this.querys[modelName][userMethodName] = userCustemMethod;
        }
      }
      
      // ! Print succesfully connection message
      console.log(`App successfully connect with mongodb : - ${URL}`);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  createSchema(schema, options) {
    const docSchema = new mongoose.Schema(
      {
        createdAt: { type: Number, default: moment().valueOf() },
        updatedAt: { type: Number, default: moment().valueOf() },
        ...schema,
        deletedAt: { type: Boolean, default: false },
      },
      {
        versionKey: false,
        autoCreate: true,
        autoIndex: true,
        timestamps: true,
        ...options,
      }
    );
    return docSchema;
  }

  createModel(collectionName, collectionSchema) {
    const model = mongoose.model(collectionName, collectionSchema);
    this.models[collectionName] = model;
    this.schemas[collectionName] = collectionSchema;
  }

  async createCustemMethodsGlobel(object) {
    try {
      const methodsSchema = Joi.object()
        .min(1)
        .required()
        .pattern(/^/, Joi.function().required());
      this.dataValidator(methodsSchema, object);
      this.custemMethodsGlobel.push(object);
    } catch (err) {
      console.log("Error in generate custem globel querys db methods");
      console.log(err);
      throw new Error(err);
    }
  }

  async createCustemMethods(modelName, object) {
    try {
      // check model exist or not
      const isModelExist = this.models[modelName];
      if (!isModelExist) {
        throw { message: `Invailed model name '${modelName}' not exist` };
      }
      // CHECK METHOD DEFULT CONFIG
      const methodsSchema = Joi.object()
        .min(1)
        .required()
        .pattern(/^/, Joi.function().required());
      this.dataValidator(methodsSchema, object);
      this.custemMethods[modelName] = object;
    } catch (err) {
      console.log("Error in generate custem querys db methods");
      console.log(err);
      throw new Error(err);
    }
  }

  useMongodb(mongodb) {
    try {
      return (req, res, next) => {
        req.mongodb = mongodb;
        next();
      };
    } catch (err) {
      console.log("Error in enable mongodb quers in req ", err);
      next(err);
    }
  }

  dataValidator(dataSchem, data) {
    try {
      const { error } = dataSchem.validate(data);
      if (error) {
        throw error.details[0].message;
      }
    } catch (err) {
      console.log(err);
      throw new Error(`Error in  createCustemMethods =============> `, err);
    }
  }
}

module.exports = mongodb;
