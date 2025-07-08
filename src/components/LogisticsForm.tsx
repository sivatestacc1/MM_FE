import React from 'react';
import { Logistics } from '../types';
import { inputFieldStyle } from '../utils/StyleConstants';

interface LogisticsFormProps {
  formData: Logistics;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogisticsForm({ formData, onChange, onFileChange }: LogisticsFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Logistics Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Parcel Service Name</label>
          <input
            type="text"
            name="parcelServiceName"
            value={formData.parcelServiceName}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bill Number</label>
          <input
            type="text"
            name="billNumber"
            value={formData.billNumber}
            onChange={onChange}
            className={inputFieldStyle}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bill Copy</label>
          <input
            type="file"
            name="billCopy"
            onChange={onFileChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>
      </div>
    </div>
  );
}