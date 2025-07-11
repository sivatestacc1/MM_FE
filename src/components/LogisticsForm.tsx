import React from 'react';
import { Logistics } from '../types';
import { cardStyle, inputFieldStyle } from '../utils/StyleConstants';
import { fileSelectionButtonStyle } from '../utils/StyleConstants';

interface LogisticsFormProps {
  formData: Logistics;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogisticsForm({ formData, onChange, onFileChange }: LogisticsFormProps) {
  return (
    <div className={"space-y-8 " + cardStyle}>
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
            className={fileSelectionButtonStyle}
            required
          />
        </div>
      </div>
    </div>
  );
}