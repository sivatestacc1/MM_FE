import React, { useState } from 'react';
import { CustomerForm } from './components/CustomerForm';
import { ItemsForm } from './components/ItemsForm';
import { LogisticsForm } from './components/LogisticsForm';
import { OrderSummary } from './components/OrderSummary';
import { Order, Item } from './types';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  // const orderNumber = Math.floor(Math.random() * 1000000);
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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
    isPrinted: false,
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
      items: [...formData.items, { name: '', weight: 0, bagSize: '', isPrinted: false }],
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
            orderNumber={formData?.orderNumber?.toString()}
            orderDate={formData?.orderDate}
          />

    );
  }

  const postNewOrder = (order: Order) => {
      fetch('http://localhost:3000/api/orders', {
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

  // const postNewOrder = async (order: Order) => {
  //   try {
  //     const response = await fetch('http://localhost:3000/api/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(order),
  //     });
  //     if (response.ok) {
  //       console.log('response : ', response.body);
  //       alert('Order submitted successfully');
  //       setOrderSubmitted(true);
  //     } else {
  //       alert('Failed to submit order');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting order:', error);
  //     alert('Failed to submit order');
  //   }
  // }

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
                className={`flex-1 text-center py-2 mx-2 rounded-md ${
                  currentStep === step
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
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
                  className="px-4 py-2 text-blue-500 hover:text-blue-600"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
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

export default App;