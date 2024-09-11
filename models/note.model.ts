import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title:string;
  content:string;
  categorie:mongoose.Schema.Types.ObjectId; // heda bsta3mlo bel populate
  user:mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  title:{type:String,required: true,unique:true},
  content:{type:String,required: true},
  categorie:{type:mongoose.Schema.Types.ObjectId,ref:'categorie',required:true}, // bel ref bhot el esem el nhat bel (model)
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model<INote>('Note', NoteSchema) || mongoose.models.Note; 