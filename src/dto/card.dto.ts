export interface CardDTO {
  card_id?: string;
  card_holder: string;
  card_number: string;
  exp_month: number;
  exp_year: number;
  cvv: number;
}

export interface CardUpdateDTO {
  card_id: string;
  card_holder?: string;
  card_number?: string;
  exp_month?: number;
  exp_year?: number;
  cvv?: number;
}

export interface CardDeleteDTO {
  card_id: string;
}
