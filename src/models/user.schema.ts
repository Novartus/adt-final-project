import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  country: { type: String, required: true },
  card_details: [
    {
      card_id: { type: String, required: false },
      card_holder: { type: String, required: true },
      card_number: { type: String, required: true },
      exp_month: { type: Number, required: true },
      exp_year: { type: Number, required: true },
      cvv: { type: Number, required: true },
      deleted_at: { type: Date, required: false },
    },
  ],
  deleted_at: { type: Date, default: null, required: false },
});

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
