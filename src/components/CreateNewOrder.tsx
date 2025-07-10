import React, { useState } from 'react';
import { CustomerForm } from './CustomerForm';
import { ItemsForm } from './ItemsForm';
import { LogisticsForm } from './LogisticsForm';
import { OrderSummary } from './OrderSummary';
import { Order, Item } from '../types';
import { ENDPOINT_URL } from '../constants';
import { primaryButtonStyle, enabledStepButtonStyle, disabledStepButtonStyle, secondaryButtonStyle, formSubmitButtonStyle } from '../utils/StyleConstants';
function CreateNewOrder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const orderDate = new Date()
  orderDate.setHours(0, 0, 0, 0);
  const invoiceDate = new Date()
  let defaultCustomer = {
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  };
  let defaultItem = {
    name: '',
    weight: 0,
    bagSize: '',
    isPrinted: true,
  };
  let defaultLogistics = {
    parcelServiceName: '',
    branch: '',
    billNumber: '',
    billCopy: null,
  };
  const [formData, setFormData] = useState<Order>({
    customer: defaultCustomer,
    logistics: defaultLogistics,
    items: [defaultItem],
    orderNumber: 0,
    orderDate: orderDate,
    invoiceDate: invoiceDate,
  });

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, customer: { ...formData.customer, [e.target.name]: e.target.value } });
  };

  const handleLogisticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, logistics: { ...formData.logistics, [e.target.name]: e.target.value } });
  };

  const handleItemChange = (index: number, field: keyof Item, value: string | number | boolean) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', weight: 0, bagSize: '', isPrinted: true }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, logistics: {...formData?.logistics, billCopy: e.target.files[0]} });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    postNewOrder(formData);
  };

  if (orderSubmitted) {
    return (

      
          <OrderSummary
            formData={formData}
            orderNumber={formData?.orderNumber}
            orderDate={formData?.orderDate}
            invoiceDate={formData?.invoiceDate}
          />

    );
  }

  const postNewOrder = (order: Order) => {
      fetch(ENDPOINT_URL + '/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {;
          setFormData(data);
          setOrderSubmitted(true);
        });
        alert('Order submitted successfully');
      } else {
        alert('Failed to submit order');
      }
    }).catch((error) => {
      console.error('Error submitting order:', error);
      alert('Failed to submit order');
    });
  }

  return (

    <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create New Order Form</h1>
        </div>
        <div className="p-0">
          <div className="mb-8 flex justify-between">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={ currentStep === step ? enabledStepButtonStyle : disabledStepButtonStyle}
              >
                Step {step}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <CustomerForm formData={formData?.customer} onChange={handleCustomerChange} />
            )}

            {currentStep === 2 && (
              <ItemsForm
                items={formData.items}
                onItemChange={handleItemChange}
                onAddItem={handleAddItem}
                onRemoveItem={handleRemoveItem}
                onFileChange={handleFileChange}
              />
            )}

            {currentStep === 3 && (
              <LogisticsForm
                formData={formData?.logistics}
                onChange={handleLogisticsChange}
                onFileChange={handleFileChange}
              />
            )}

            <div className="flex justify-between pt-4 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={ secondaryButtonStyle }
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className={"ml-auto " + primaryButtonStyle}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className= {"ml-auto " +  formSubmitButtonStyle }
                >
                  Submit Order
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
  );
}

export default CreateNewOrder;