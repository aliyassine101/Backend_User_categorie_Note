import mongoose, { Schema, Document } from 'mongoose';

export interface ICategorie extends Document {
  name:string;
  user:mongoose.Schema.Types.ObjectId

  createdAt: Date;
  updatedAt: Date;
}

const CategorieSchema: Schema = new Schema({
  name:{type:String,required: true,unique:true},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model<ICategorie>('categorie', CategorieSchema) || mongoose.models.Category; 