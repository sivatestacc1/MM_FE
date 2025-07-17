import React, { useState, useEffect, useRef } from 'react';
import ChevronDown from "../asset/img/chevron_down.png";
import CloseIcon from "../asset/img/x.png";
import AddIcon from "../asset/img/plus.png";
import { inputFieldStyle } from '../utils/StyleConstants';

export interface DropdownItem {
    id: string;
    value: string;
}

export interface SearchableDropdownProps {
    items: DropdownItem[];
    selectedItem?: DropdownItem | null;
    onItemSelect: (item: DropdownItem) => void;
    onItemsChange?: (items: DropdownItem) => void;
    placeholder?: string;
    allowAddNew?: boolean;
    maxHeight?: string;
    className?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    items: initialItems,
    selectedItem = null,
    onItemSelect,
    onItemsChange,
    placeholder = "Select an item...",
    allowAddNew = true,
    maxHeight = "200px",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState<DropdownItem[]>(initialItems);
    const [filteredItems, setFilteredItems] = useState<DropdownItem[]>(initialItems);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter items based on search text
    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredItems(items);
        } else {
            const filtered = items.filter(item =>
                item.value.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredItems(filtered);
        }
        setHighlightedIndex(-1);
    }, [searchText, items]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchText('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                setIsOpen(false);
                setSearchText('');
                setHighlightedIndex(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const maxIndex = allowAddNew && searchText.trim() &&
                        !items.some(item => item.value.toLowerCase() === searchText.toLowerCase())
                        ? filteredItems.length
                        : filteredItems.length - 1;
                    return prev < maxIndex ? prev + 1 : 0;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const maxIndex = allowAddNew && searchText.trim() &&
                        !items.some(item => item.value.toLowerCase() === searchText.toLowerCase())
                        ? filteredItems.length
                        : filteredItems.length - 1;
                    return prev > 0 ? prev - 1 : maxIndex;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0) {
                    if (highlightedIndex < filteredItems.length) {
                        handleItemSelect(filteredItems[highlightedIndex]);
                    } else {
                        // Add new item
                        handleAddNewItem();
                    }
                }
                break;
        }
    };

    const handleItemSelect = (item: DropdownItem) => {
        onItemSelect(item);
        setIsOpen(false);
        setSearchText('');
        setHighlightedIndex(-1);
    };

    const handleAddNewItem = () => {
        if (searchText.trim() && !items.some(item => item.value.toLowerCase() === searchText.toLowerCase())) {
            const newItem: DropdownItem = {
                id: Date.now().toString(),
                value: searchText.trim()
            };

            const updatedItems = [...items, newItem];
            setItems(updatedItems);
            onItemsChange?.(newItem);
            handleItemSelect(newItem);
        }
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        onItemSelect(null as any);
    };

    const shouldShowAddOption = allowAddNew &&
        searchText.trim() &&
        !items.some(item => item.value.toLowerCase() === searchText.toLowerCase());

    return (
        <div
            ref={dropdownRef}
            className={`relative w-full ${className}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={`flex items-center justify-between cursor-pointer ${inputFieldStyle}  ${isOpen ? 'ring-1 ring-blue-600 border-blue-600' : ''} `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`block truncate  ${selectedItem ? 'text-blue-800' : 'text-gray-500'}`}>
                    {selectedItem ? selectedItem.value : placeholder}
                </span>
                <div className="flex items-center space-x-1">
                    {selectedItem && (
                        <button
                            onClick={clearSelection}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                        >
                            <img src={CloseIcon} className='w-4 h-4 self-center mx-18' />
                        </button>
                    )}
                    <img src={ChevronDown} className={`w-4 h-4 self-center text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search..."
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        />
                    </div>

                    {/* Items list */}
                    <div className="overflow-y-auto" style={{ maxHeight }}>
                        {filteredItems.length === 0 && !shouldShowAddOption ? (
                            <div className="px-3 py-2 text-sm text-gray-500">
                                No items found
                            </div>
                        ) : (
                            <>
                                {filteredItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`
                      px-3 py-2 text-sm cursor-pointer transition-colors
                      ${highlightedIndex === index ? 'bg-blue-100 text-blue-900' : 'text-gray-900 hover:bg-gray-100'}
                      ${selectedItem?.id === item.id ? 'bg-blue-50' : ''}
                    `}
                                        onClick={() => handleItemSelect(item)}
                                    >
                                        {item.value}
                                    </div>
                                ))}

                                {/* Add new item option */}
                                {shouldShowAddOption && (
                                    <div
                                        className={`
                      px-3 py-2 text-sm cursor-pointer transition-colors flex items-center space-x-2
                      ${highlightedIndex === filteredItems.length ? 'bg-blue-100 text-blue-900' : 'text-blue-600 hover:bg-blue-50'}
                    `}
                                        onClick={handleAddNewItem}
                                    >
                                        <img src={AddIcon} className='w-4 h-4 self-center' />
                                        <span>Add "{searchText}"</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};