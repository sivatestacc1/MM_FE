import React from 'react';
import { getDocument } from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist'
import { FileObject, Item } from './types/index';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()


export const extractTableFromPDF = async (event: React.ChangeEvent<HTMLInputElement>): Promise<FileObject> => {

  const file = event.target.files?.[0];
  let jsonData: FileObject = { 
    invoice: { number: '', date: new Date()}, 
    customer: {name: '', address: '', city: '', state: '', pincode: '', phone: ''},
    items: [{name: '', weight: 0, bagSize: '', isPrinted: true}]
  }

  const calculateBagCount = (value: number, size: number) : {bagSize: number, bagCount: number}[] => {
    let bagCount = 0;
    let sizeArray = [5, 10, 20, 30, 50];
    let selectedIndex = sizeArray.indexOf(size);
    let selectedSize = sizeArray[selectedIndex];
    if (value % selectedSize === 0) {
      bagCount = value / selectedSize;
    } else if ((value % selectedSize) > selectedSize) {
      bagCount = Math.floor(value / selectedSize) + 1;
    } else {
      bagCount = Math.floor(value / selectedSize);
      selectedSize = (selectedIndex-1) > 0 && (selectedIndex-1) < sizeArray.length ? sizeArray[selectedIndex - 1] : selectedSize;
      let nextBag = calculateBagCount((value % selectedIndex), selectedSize);
      return [{bagSize: selectedSize, bagCount: bagCount}, ...nextBag ];
    };
    return [{bagSize: selectedSize, bagCount: bagCount}];
  }
  const formatBag = (bagData: {bagSize: number, bagCount: number}[], bagDataSting: string) => {
    if (bagData.length > 0) {
      bagData.forEach((aBagData: ({bagSize: number, bagCount: number})) => {
        bagDataSting = bagDataSting + " " + aBagData.bagSize + " KG bag x " + aBagData.bagCount
      });
    }
    return bagDataSting;
  }
  const calculateBagData = (quantity: number) => {
    let bagDataSting = "";
    if(quantity >= 3 && quantity <= 5) {
      let bagData = calculateBagCount(quantity, 5);
      bagDataSting = formatBag(bagData, bagDataSting);
    } else if (quantity > 5 && quantity <= 10) {
      let bagData = calculateBagCount(quantity, 10);
      bagDataSting = formatBag(bagData, bagDataSting); 
    } else if (quantity > 10 && quantity <= 20) {
      let bagData = calculateBagCount(quantity, 20);
      bagDataSting = formatBag(bagData, bagDataSting); 
    } else if (quantity > 20 && quantity <= 30) {
      let bagData = calculateBagCount(quantity, 30);
      bagDataSting = formatBag(bagData, bagDataSting); 
    } else if (quantity > 30 && quantity <= 50) {
      let bagData = calculateBagCount(quantity, 50);
      bagDataSting = formatBag(bagData, bagDataSting); 
    } 
    return bagDataSting;
  }

  if (!file) return jsonData;

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  const allLines: string[] = [];
  let itemsArray: (String | undefined)[] = [];


  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { //for each page
    let defaultItem: Item = {name: '', weight: 0, bagSize: '', isPrinted: true};
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent(); // read content

    let strings = content.items.map((item: any) => {
      if (item.str === ' ') {
        return '|'
      } else if (item.str === '\n') {
        return '*'
      } else {
        return item.str
      }
    })?.join('^');
    strings = strings?.split("^|^")?.join('|'); // full page string
    // console.log(" ===> str", strings)

    const pageLines = strings.split('^');
    allLines.push(...pageLines.map(line => line.trim()).filter(Boolean)); // parse string to lines

    let addressString = '';
    let addressStartIndex = -1;
    let addressEndIndex = -1;
    allLines?.forEach((aLine, index) => { // filter only needed lines to fetch customer details
      if (aLine?.includes('#|:')) {
        const [_, data] = aLine?.split('#|:');
        jsonData.invoice.number = data?.trim();
      } else if (aLine?.includes('Invoice Date|:')) {
        const [_, data] = aLine?.split('Invoice Date|:');
        const parts = data?.trim()?.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        jsonData.invoice.date = date;
      } else if (aLine?.includes('Bill To|Ship To') && (index + 1 < allLines?.length)) {
        jsonData.customer.name = allLines[index + 1]
        addressStartIndex = index + 2;
      } else if (aLine?.includes('Phone:')) {
        const [_, data] = aLine?.split('Phone:');
        jsonData.customer.phone = data?.trim();
        addressEndIndex = index;

        if(addressString === '' && addressStartIndex > 0 && addressEndIndex > 0 && addressStartIndex < allLines?.length && addressEndIndex < allLines?.length && addressStartIndex <= addressEndIndex) {
          for (let i=addressStartIndex; i<addressEndIndex; i++) {
            addressString = addressString + allLines[i];
          }
          jsonData.customer.address = addressString;
        }
      }
    })
    // console.log("====> parseRows", allLines)

    if (strings?.includes('%|Amt|%|Amt^')) {
      let [_, wholeItemString] = strings?.split('%|Amt|%|Amt^');
      itemsArray = wholeItemString.split(/\^\d{1,2}\|/g);
      itemsArray = itemsArray?.filter((item) => {
        if (item?.includes('|')) { return item }
      });
      // console.log("====> 1 items array", itemsArray);
    } else if (strings?.includes('%|Amt')) {
      let [_, wholeItemString] = strings?.split('%|Amt');
      itemsArray = wholeItemString.split(/\^\d{1,2}\|/g);
      itemsArray = itemsArray?.filter((item) => {
        if (item?.includes('|')) { return item }
      });
      // console.log("====> 2 items array", itemsArray);
    }


    let aParseArray: Item[] = [];
    itemsArray?.forEach((item) => { // item data parsing and fetching
      if (item?.includes('|')) {
        const data = item?.split('|');
        let name = '';
        let weigth = 0;
        if (data?.length >= 3) {
          if (data[0]?.includes('^')) {
            const nameTextArray = data[0]?.split('^');
            if (nameTextArray && nameTextArray?.length >= 2) {
              name = nameTextArray[0]?.trim() + " - " + nameTextArray[1]?.trim();
            }
          } else {
            name = data[0]?.trim();
          }

          if (data[2]?.includes('^')) {
            const numberTextarray = data[2]?.split('^');
            if (numberTextarray && numberTextarray?.length >= 2) {
              weigth = numberTextarray[0] ? Number((numberTextarray[0])?.trim()) : 0;
            }
          } else if(data[1]?.includes('^')) {
            const numberTextarray = data[1]?.split('^');
            if (numberTextarray && numberTextarray?.length >= 2) {
              weigth = numberTextarray[0] ? Number((numberTextarray[0])?.trim()) : 0;
            }
          }
        }

        defaultItem = { name: name, weight: weigth, isPrinted: true, bagSize: calculateBagData(weigth) };
        aParseArray.push(defaultItem);
      }
    });
    jsonData.items = aParseArray
  }

  return jsonData;

}
