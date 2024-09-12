import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username:string;
  email: string;
  password: string;  
  role: 'user' | 'admin';
  phone: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username:{type:String,required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  verificationCode: String,
  verificationCodeExpires: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export default mongoose.model<IUser>('User', UserSchema) || mongoose.models.User;