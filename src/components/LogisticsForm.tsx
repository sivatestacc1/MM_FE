import React, { useEffect, useState } from 'react';
import { Logistics } from '../types';
import { cardStyle, inputFieldStyle } from '../utils/StyleConstants';
import { fileSelectionButtonStyle } from '../utils/StyleConstants';
import { SearchableDropdown, DropdownItem } from './SearchableDropdown';
import { getRandomInt } from '../utils/Util';

interface LogisticsFormProps {
  formData: Logistics;
  onChange: (e: { name: string, value: string }) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DataSet {
  id: string;
  label: string;
  value: string;
}

export function LogisticsForm({ formData, onChange, onInputChange, onFileChange }: LogisticsFormProps) {

  const [items, setItems] = useState<DataSet[]>([
    { id: '1', label: 'Apple', value: '111' },
    { id: '1a', label: 'Apple', value: '112' },
    { id: '1b', label: 'Apple', value: '113' },
    { id: '2', label: 'Banana', value: '222' },
    { id: '3', label: 'Cherry', value: '333' },
    { id: '4', label: 'Date', value: '444' },
    { id: '5', label: 'Elderberry', value: '555' },
    { id: '6', label: 'Fig', value: '666' },
    { id: '7', label: 'Grape', value: '777' },
    { id: '8', label: 'Honeydew', value: '888' },
  ]);

  const [selectedParentItem, setSelectedParentItem] = useState<DropdownItem | null>(null);
  const [selectedChildItem, setSelectedChildItem] = useState<DropdownItem | null>(null);
  const [parentItems, setParentItems] = useState<DropdownItem[]>([]);
  const [childItems, setChildItems] = useState<DropdownItem[]>([]);
  const [tempParent, setTempParent] = useState<DataSet | null>(null);

  const handleParentItemAdd = (newItem: DropdownItem) => {
    const randomInt: number = getRandomInt(0, 1000);
    setTempParent({ id: randomInt.toString(), label: newItem.value, value: "" })
  };

  const handleChildItemAdd = (newItem: DropdownItem) => {
    if (tempParent) {
      let dataItem = { ...tempParent, value: newItem.value }
      setTempParent(dataItem);
      setItems([...items, dataItem]);
      setTempParent(null);
    }
  }

  useEffect(() => {
    let parents: DropdownItem[] = [];
    items.forEach((aItem) => {
      if ((parents.filter(i => aItem.label === i.value)).length === 0) {
        const randomInt: number = getRandomInt(0, 1000);
        parents.push({ id: randomInt.toString(), value: aItem.label })
      }
    })
    setParentItems(parents);
  }, [items])

  useEffect(() => {
    if (selectedParentItem) {
      let children: DropdownItem[] = [];
      items.forEach((aItem) => {
        if (aItem.label === selectedParentItem.value) {
          const randomInt: number = getRandomInt(0, 1000);
          children.push({ id: randomInt.toString(), value: aItem.value })
        }
      });
      setChildItems(children);
    } else {
      setChildItems([]);
    }
  }, [selectedParentItem, items])

  return (
    <div className={"space-y-8 " + cardStyle}>
      <h2 className="text-xl font-semibold">Logistics Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Parcel Service Name</label>
          {parentItems.length > 0 && <SearchableDropdown
            items={parentItems}
            selectedItem={selectedParentItem}
            onItemSelect={(item) => { onChange({ name: "parcelServiceName", value: item.value }); setSelectedParentItem(item); }}
            onItemsChange={handleParentItemAdd}
            placeholder="Choose a parcel service..."
            allowAddNew={true}
            maxHeight="150px"
          />}
          {/* <input
            type="text"
            name="parcelServiceName"
            value={formData.parcelServiceName}
            onChange={onChange}
            className={inputFieldStyle}
            required
          /> */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Branch</label>
          {(childItems.length > 0 || tempParent) && <SearchableDropdown
            items={childItems}
            selectedItem={selectedChildItem}
            onItemSelect={(item) => { onChange({ name: "branch", value: item.value }); setSelectedChildItem(item); }}
            onItemsChange={handleChildItemAdd}
            placeholder="Choose a branch..."
            allowAddNew={true}
            maxHeight="150px"
          />}
          {/* <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={onChange}
            className={inputFieldStyle}
            required
          /> */}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bill Number</label>
          <input
            type="text"
            name="billNumber"
            value={formData.billNumber}
            onChange={onInputChange}
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