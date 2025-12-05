export interface BarbershopFormData {
  name: string;
  description: string;
  phone: string;
  address: string;

  zipcode: string;
  city: string;
  state: string;
  address_number: string;
  address_complement: string;
  neighborhood: string;

  cnpj: string;
  cpf?: string | null; // se quiser manter
  logo_url: string;
  cover_url: string;

  avg_price: string;
  avg_time_minutes: string;

  facilities: string[];
  payment_methods: string[];

  opening_hours: any;
  social_links: any;
}
