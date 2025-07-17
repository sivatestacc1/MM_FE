import React, { useEffect, useState } from 'react';
import { Logistics } from '../types';
import { cardStyle, inputFieldStyle } from '../utils/StyleConstants';
import { fileSelectionButtonStyle } from '../utils/StyleConstants';
import { SearchableDropdown, DropdownItem } from './SearchableDropdown';
import { getRandomInt } from '../utils/Util';
import { ENDPOINT_URL } from '../constants';

interface LogisticsFormProps {
  formData: Logistics;
  onChange: (e: { name: string, value: string }) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface DataSet {
  id: string;
  parcelService: string;
  branch: string;
}

export function LogisticsForm({ formData, onChange, onInputChange, onFileChange }: LogisticsFormProps) {

  

  const [items, setItems] = useState<DataSet[]>([]);

  const [selectedParentItem, setSelectedParentItem] = useState<DropdownItem | null>(null);
  const [selectedChildItem, setSelectedChildItem] = useState<DropdownItem | null>(null);
  const [parentItems, setParentItems] = useState<DropdownItem[]>([]);
  const [childItems, setChildItems] = useState<DropdownItem[]>([]);
  const [tempParent, setTempParent] = useState<DataSet | null>(null);

  const fetchLogistics = async () => {
    try {
                const response = await fetch(ENDPOINT_URL + "/api/logistics",
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                let aData = JSON.parse(JSON.stringify(data));
                setItems(aData);
            } catch (err) {
                //
            } finally {
                //
            }
  }

  useEffect(() => { fetchLogistics() }, []);

  const handleParentItemAdd = (newItem: DropdownItem) => {
    const randomInt: number = getRandomInt(0, 1000);
    setTempParent({ id: randomInt.toString(), parcelService: newItem.value, branch: "" });
  };

  const handleChildItemAdd = (newItem: DropdownItem) => {
    if (tempParent) {
      let dataItem = { ...tempParent, branch: newItem.value }
      setTempParent(dataItem);
      setItems([...items, dataItem]);
      setTempParent(null);
    }
  }

  useEffect(() => {
    let parents: DropdownItem[] = [];
    items.forEach((aItem) => {
      if ((parents.filter(i => aItem.parcelService === i.value)).length === 0) {
        const randomInt: number = getRandomInt(0, 1000);
        parents.push({ id: randomInt.toString(), value: aItem.parcelService })
      }
    })
    setParentItems(parents);
  }, [items])

  useEffect(() => {
    if (selectedParentItem) {
      let children: DropdownItem[] = [];
      items.forEach((aItem) => {
        if (aItem.parcelService === selectedParentItem.value) {
          const randomInt: number = getRandomInt(0, 1000);
          children.push({ id: randomInt.toString(), value: aItem.branch })
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
            onItemSelect={(item) => { onChange({ name: "parcelServiceName", value: item.value }); setSelectedParentItem(item); setSelectedChildItem(null);}}
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