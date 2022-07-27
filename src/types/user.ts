import { Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  card_details?: PaymentCard[];
  deleted_at: Date;
}

export interface PaymentCard {
  card_id: string;
  card_holder: string;
  card_number: string;
  exp_month: number;
  exp_year: number;
  cvv: number;
  deleted_at: Date;
}
