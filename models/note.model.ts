import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  username: string;
  email: string;
}

// Define the Categorie interface
export interface ICategorie extends Document {
  name: string;
}

// Define the Note interface
export interface INote extends Document {
  title: string;
  content: string;
  categorie: ICategorie; // This should be of type ICategorie, not ObjectId
  user: IUser; // This should be of type IUser, not ObjectId
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