export interface Item {
  name: string;
  weight: number;
  bagSize: string;
  isPrinted: boolean;
}

export interface Customer {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Logistics {
  parcelServiceName: string;
  branch: string;
  billNumber: string;
  billCopy: File | null;
}

export interface Order {
  orderNumber: number;
  orderDate: string;
  customer: Customer;
  // doorNumber: string;
  // street: string;
  // district: string;
  // state: string;
  // pinCode: string;
  // phoneNumber: string;
  items: Item[];
  logistics: Logistics;
  // parcelServiceName: string;
  // serviceBranch: string;
  // billNumber: string;
  // billCopy: File | null;
}