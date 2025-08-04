import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Order } from '../types';
import ReceiptBg from '../asset/img/bg-strip.png';
import PlainBag from '../asset/img/plain.png';
import PrintedBag from '../asset/img/printer.png';

interface OrderSummaryProps {
  formData: Order;
  orderNumber: number;
  orderDate: Date;
  invoiceDate: Date;
}



export function OrderSummary({ formData, orderNumber, orderDate, invoiceDate }: OrderSummaryProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleShare = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current);

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'card.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title: 'New Order',
        text: 'Sharing this order via image',
      });
    } else {
      alert('Sharing not supported on this browser/device.');
    }
  }
  return (
    <div>
      <button onClick={handleShare} className="mb-8 px-4 py-2 bg-green-500 text-white rounded">
        Share Order
      </button>
      <div className="m-0 p-2 w-full" ref={cardRef} style={{ backgroundColor: 'transparent' }}>
        <div className='w-full h-6 bg-cover p-0 m-0 bg-center' style={{ backgroundImage: `url(${ReceiptBg})` }}></div>
        <div className="space-y-6 bg-white p-2 shadow-md" >
          <div className="flex justify-between items-start" >
            <div>
              <h2 className="text-[28px] font-bold text-gray-900">Order #{orderNumber}</h2>
            </div>
            <div className='flex flex-col'>
            <p className="text-base text-gray-800">Order Date: { new Date(orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',})} </p>
            <p className="text-base text-gray-800">Invoice Date: { new Date(invoiceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric',})} </p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-[20px] font-bold mb-2">Customer Information</h3>
            <div className="grid grid-cols-1 gap-0 p-4 ">
              <p><span className="text-gray-600">Name:</span> {formData.customer.name}</p>
              <p><span className="text-gray-600">Phone:</span> {formData.customer.phone}</p>
              <p className="col-span-1">
                <span className="text-gray-600">Address:</span> {formData.customer.address},
                {formData.customer.city}, {formData.customer.state} - {formData.customer.pincode}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-[20px] font-bold mb-2">Items</h3>
            <div className="">
              <div key={"title-row"} className="grid grid-cols-4 gap-0 bg-gray-50 rounded border-gray-100">
                <p className='col-span-2 flex justify-center text-center text-sm font-bold'>Item Name</p>
                <p className='flex justify-center text-sm font-bold'>Wgt - KG</p>
                {/* <p className='flex justify-center text-center text-[12px]'>Bag Size</p> */}
                <p className='flex justify-center text-center text-sm font-bold'>Bag Type</p>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className={`grid grid-cols-4 p-1 mb-1 ${index%2 === 0 ? 'bg-blue-50  border-blue-100' : 'bg-gray-100 border-gray-200'} rounded border-2`}>
                  <p className={`col-span-2 border-r-2 text-base ${index%2 === 0 ? 'border-blue-100' : 'border-gray-200'}`}>{item.name}</p>
                  <p className={`border-r-2 text-center text-base ${index%2 === 0 ? 'border-blue-100' : 'border-gray-200'}`}>{item.weight} KG</p>
                  <div className={`col-span-1 flex flex-row w-full`}>
                    <img src={item.isPrinted ? PrintedBag : PlainBag} className='w-12 h-12 self-center' />
                    <p className={`text-[12px] text-center`}>{item.bagSize} <br /> <p className='text-pink-600'>{item.isPrinted ? 'Printed bag' : 'Plain bag'}</p></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-[20px] font-bold mb-2">Logistics Information</h3>
            <div className="grid grid-cols-1 gap-0 p-4">
              <p><span className="text-gray-600">Customer Name:</span> <span className="font-bold">{formData.customer.name}</span></p>
              <p><span className="text-gray-600">Parcel Service:</span> <span className="font-bold">{formData.logistics.parcelServiceName}</span></p>
              <p><span className="text-gray-600">Branch:</span> <span className="font-bold">{formData.logistics.branch}</span></p>
              <p><span className="text-gray-600">Bill Number:</span> {formData.logistics.billNumber}</p>
              {/* <p><span className="text-gray-600">Bill Copy:</span> {formData.logistics.billCopy?.name || 'Not attached'}</p> */}
            </div>
          </div>
        </div>
        <div className='w-full h-6 bg-cover p-0 m-0 bg-center' style={{ backgroundImage: `url(${ReceiptBg})`, backgroundRepeat: 'no-repeat', transform: 'rotate(180deg)' }}></div>
      </div>
    </div>
  );
}