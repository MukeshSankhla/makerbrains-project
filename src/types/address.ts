
export type Address = {
  id: string;
  label: string; // e.g. "Home", "Office"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  updatedAt: number;
};
