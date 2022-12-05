const mongoose = require("mongoose");

const OSchemaDefinition = {
     title: String,
     content: {
         type: String,
         default: "Input Content...",
     },
     itemViewCnt: {
         type: Number,
         default: 0,
     },
     likeCnt: {
        type: Number,
        default: 0,
     }, comment: {
        type: String,
        default: "",
     },
 };
 const OSchemaOptions = { timestamps: true };

 const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

 const FeedModel = mongoose.model("feed", schema);

 module.exports = FeedModel;