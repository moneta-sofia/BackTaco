import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema({
    name: String,
},{
    versionKey: false,
});

const Role = mongoose.model('Role',roleSchema);
export {Role};