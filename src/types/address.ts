
export type Address = {
  id: string;
  userId: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  createdAt: number;
  updatedAt: number;
};
