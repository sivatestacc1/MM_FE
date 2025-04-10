import { Order } from '../types';

interface OrderSummaryProps {
  formData: Order;
  orderNumber: string;
  orderDate: string;
}

export function OrderSummary({ formData, orderNumber, orderDate }: OrderSummaryProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
          <p className="text-sm text-gray-500">Order #{orderNumber}</p>
        </div>
        <p className="text-sm text-gray-500">{orderDate}</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="text-gray-600">Name:</span> {formData.customer.name}</p>
          <p><span className="text-gray-600">Phone:</span> {formData.customer.phone}</p>
          <p className="col-span-2">
            <span className="text-gray-600">Address:</span> {formData.customer.address},
            {formData.customer.city}, {formData.customer.state} - {formData.customer.pincode}
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Items</h3>
        <div className="space-y-2">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-2 bg-gray-50 rounded">
              <p>{item.name}</p>
              <p>{item.weight} KG</p>
              <p>{item.bagSize}</p>
              <p>{item.isPrinted ? 'Printed' : 'Not Printed'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-2">Logistics Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="text-gray-600">Service:</span> {formData.logistics.parcelServiceName}</p>
          <p><span className="text-gray-600">Branch:</span> {formData.logistics.branch}</p>
          <p><span className="text-gray-600">Bill Number:</span> {formData.logistics.billNumber}</p>
          <p><span className="text-gray-600">Bill Copy:</span> {formData.logistics.billCopy?.name || 'Not attached'}</p>
        </div>
      </div>
    </div>
  );
}