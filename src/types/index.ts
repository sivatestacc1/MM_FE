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
  orderDate: Date;
  invoiceDate: Date;
  customer: Customer;
  items: Item[];
  logistics: Logistics;
}

export interface Invoice {
  number: string;
  date: Date;
}

export interface Item {
  name: string;
  weight: number;
  bagSize: string;
  isPrinted: boolean;
}

export interface FileObject {
  invoice: Invoice;
  customer: Customer;
  items: Item[];
}