import mongoose, { Document, Schema } from 'mongoose';

interface ICar extends Document {
  title: string;
  price: string;
  description: string;
  location: string;
  date: string;
  views: string;
  imageUrl: string;
}

const carSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: false },
  date: { type: String, required: true },
  views: { type: String, required: false },
  imageUrl: { type: String, required: false },
});

const Car = mongoose.model<ICar>('Car', carSchema, 'previous_data');

export default Car;
