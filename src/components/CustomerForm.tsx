import React from 'react';
import { Customer } from '../types';
import { inputFieldStyle } from '../utils/StyleConstants';

interface CustomerFormProps {
  formData: Customer;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CustomerForm({ formData, onChange }: CustomerFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Customer Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
      </div>
    </div>
  );
}