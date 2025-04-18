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
  let itemsArray: String[] = [];


  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) { //for each page
    let itemStart = 0;
    let itemEnd = 0;
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
    })
      ?.join('^');
    strings = strings?.split("^|^")?.join('|'); // full page string
    // console.log(" ===> str", strings)

    const pageLines = strings.split('^');
    allLines.push(...pageLines.map(line => line.trim()).filter(Boolean)); // parse string to lines
    allLines?.forEach((aLine, index) => { // filter only needed lines
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
      } else if (aLine?.includes('%|Amt')) {
        itemStart = index + 1;
      } else if (aLine?.includes('Scan to')) {
        itemEnd = index - 1;
      }
    })
    // console.log("====> parseRows", allLines)

    if (itemStart !== 0 && itemStart < allLines?.length && itemEnd < allLines?.length) { // fetch item details
      itemsArray = allLines?.slice(itemStart, itemEnd);
      itemsArray?.forEach((item) => {
        if (item?.includes('|') && !item?.includes('%|')) {
          const data = item?.split('|');
          if (data?.length <= 4) {
            defaultItem = { name: (data[1])?.trim(), weight: (data[3])?.trim() ? Number((data[3])?.trim()) : 0, isPrinted: false, bagSize: '' };
            jsonData.items.push(defaultItem);
          }
        }
      })
    }
  }

  return jsonData;

}
