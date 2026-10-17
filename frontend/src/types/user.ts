export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "superadmin" | "admin" | "staff" | "customer";
  isActive: boolean;
  addresses?: IAddress[];
  createdAt: string;
}

