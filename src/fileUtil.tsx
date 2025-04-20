import React from 'react';
import { getDocument } from 'pdfjs-dist';
import * as pdfjs from 'pdfjs-dist'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

// interface InvoiceItem {
//   item: string;
//   description: string;
//   quantity: string;
//   unit: string;
//   rate: string;
//   cgstPercent?: string;
//   cgstAmount?: string;
//   sgstPercent?: string;
//   sgstAmount?: string;
//   total: string;
// }

export const extractTableFromPDF = async (event: React.ChangeEvent<HTMLInputElement>) => {

  const file = event.target.files?.[0];
  const jsonData: any = {
    invoice: {},
    customer: {},
    items: []
  };
  if (!file) return;

  const buffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: buffer }).promise;

  const allLines: string[] = [];
  let itemsArray: (String | undefined)[] = [];


  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { //for each page
    let defaultItem = {
      name: '',
      weight: 0,
      bagSize: '',
      isPrinted: false,
    };
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
        jsonData.invoice.date = data?.trim();
      } else if (aLine?.includes('Bill To|Ship To') && (index + 1 < allLines?.length)) {
        jsonData.customer.name = allLines[index + 1]
      } else if (aLine?.includes('Phone:')) {
        const [_, data] = aLine?.split('Phone:');
        jsonData.customer.phone = data?.trim();
      }
    })
    // console.log("====> parseRows", allLines)

    let [_, wholeItemString] = strings?.split('%|Amt');
    itemsArray = wholeItemString.split(/\^\d{1,2}\|/g);
    itemsArray = itemsArray?.filter((item) => {
      if (item?.includes('|')) { return item }
    });
    // console.log("====> items array", itemsArray);

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
        jsonData.items.push(defaultItem);
      }
    });
  }

  return jsonData;

}
