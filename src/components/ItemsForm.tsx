import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Item } from '../types';
import { cardStyle, inputFieldStyle } from '../utils/StyleConstants';
import { calculateBagData } from '../fileUtil';

interface ItemsFormProps {
  items: Item[];
  onItemChange: (index: number, field: keyof Item, value: string | number | boolean) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemsForm({ items, onItemChange, onAddItem, onRemoveItem, onFileChange }: ItemsFormProps) {
  const [quantity, setQuantity] = useState({index: -1, value: 0});
  const [bagSizeText, setBagSizeText] = useState({index: -1, value: ""});
  useEffect(()=>{
    if(quantity.index > -1 && quantity.value > 0) {
      let aText = calculateBagData(quantity.value);
      setBagSizeText({index: quantity.index, value: aText});
      onItemChange(quantity.index, "bagSize", aText);
    }
  }, [quantity])
  return (
    <div className={"space-y-8 mt-8 " + cardStyle}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Items</h2>
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>
      
      {items.map((item, index) => {
        return (<div key={index} className="p-4 border-2 rounded-md space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Item #{index + 1}</h3>
            <button
              type="button"
              onClick={() => onRemoveItem(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Bill Copy</label>
              <input
                type="file"
                name="billCopy"
                onChange={onFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => onItemChange(index, 'name', e.target.value)}
                className={inputFieldStyle}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (KG)</label>
              <input
                type="number"
                value={item.weight}
                onChange={(e) => {
                  onItemChange(index, 'weight', parseFloat(e.target.value));
                }}
                onBlur={(e) => {
                  let aValue = parseFloat(e.target.value);
                  setQuantity({index: index, value: aValue});
                }}
                className={inputFieldStyle}
                required
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bag Size</label>
              <input
                type="text"
                value={bagSizeText.index === index ? bagSizeText.value : item.bagSize}
                onChange={(e) => onItemChange(index, 'bagSize', e.target.value)}
                className={inputFieldStyle}
                required
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.isPrinted}
                  onChange={(e) => onItemChange(index, 'isPrinted', e.target.checked)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Printed Bag</span>
              </label>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
}