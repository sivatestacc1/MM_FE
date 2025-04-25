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
    items: [{name: '', weight: 0, bagSize: '', isPrinted: false}]
  }
  if (!file) return jsonData;

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  const allLines: string[] = [];
  let itemsArray: (String | undefined)[] = [];


  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { //for each page
    let defaultItem: Item = {name: '', weight: 0, bagSize: '', isPrinted: false};
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
      } else if (aLine?.includes('Phone:')) {
        const [_, data] = aLine?.split('Phone:');
        jsonData.customer.phone = data?.trim();
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

        defaultItem = { name: name, weight: weigth, isPrinted: false, bagSize: '' };
        aParseArray.push(defaultItem);
      }
    });
    jsonData.items = aParseArray
  }

  return jsonData;

}
