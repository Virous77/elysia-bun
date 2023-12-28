import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  email: { type: String, required: true, minlength: 3, maxlength: 255 },
  password: { type: String, required: true, minlength: 3, maxlength: 255 },
});

export default mongoose.model<IUser>("User", UserSchema);
