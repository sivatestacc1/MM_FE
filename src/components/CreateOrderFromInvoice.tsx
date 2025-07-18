import React, { useEffect, useState } from 'react';
import { CustomerForm } from './CustomerForm';
import { ItemsForm } from './ItemsForm';
import { LogisticsForm } from './LogisticsForm';
import { OrderSummary } from './OrderSummary';
import { Order, Item, Customer, Logistics } from '../types';
import { ENDPOINT_URL } from '../constants';
import { extractTableFromPDF } from '../fileUtil';
import { FileObject } from '../types';
import { fileSelectionButtonStyle, primaryButtonStyle, enabledStepButtonStyle, disabledStepButtonStyle, secondaryButtonStyle, formSubmitButtonStyle, cardStyle } from '../utils/StyleConstants';

export const CreateOrderFromInvoice = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isInvoiceSelected, setIsInvoiceSelected] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const orderDate = new Date();
    orderDate.setHours(0, 0, 0, 0);
    const invoiceDate = new Date()
    let defaultCustomer: Customer = {
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
    };
    let defaultLogistics: Logistics = {
        parcelServiceName: '',
        branch: '',
        billNumber: '',
        billCopy: null,
    };
    const [formData, setFormData] = useState<Order>({
        customer: defaultCustomer,
        logistics: defaultLogistics,
        items: [],
        orderNumber: 0,
        orderDate: orderDate,
        invoiceDate: invoiceDate,
    });

    useEffect(()=>{
        setIsInvoiceSelected(false);
    }, []);

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, customer: { ...formData.customer, [e.target.name]: e.target.value } });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, logistics: { ...formData.logistics, [e.target.name]: e.target.value } });
    }
    
    const handleLogisticsChange = (e: {name:string, value: string}) => {
        setFormData({ ...formData, logistics: { ...formData.logistics, [e.name]: e.value } });
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
            setIsInvoiceSelected(true);
            // setFormData({ ...formData, logistics: {...formData?.logistics, billCopy: e.target.files[0]} });
            // }
            extractTableFromPDF(e).then((invoiceData : FileObject) => {
                console.log(invoiceData);
                setFormData({...formData, customer: {...formData.customer, name: invoiceData?.customer.name, phone: invoiceData.customer.phone, address: invoiceData.customer.address}, invoiceDate: invoiceData.invoice.date, orderDate: orderDate, orderNumber: 0, items: invoiceData.items, logistics: {...formData.logistics, billNumber: invoiceData.invoice.number/*, billCopy: e.target.files[0] */}})
            });
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
                res.json().then((data) => {
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

    return <div className="container mx-auto">
        <div className="text-center mb-8">
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Create Order From Invoice</h1>
        </div>
        <div className="p-0">
            <div className="mb-8 flex justify-between">
                {[1, 2].map((step) => (
                    <button
                        key={step}
                        onClick={() => setCurrentStep(step)}
                        className={ currentStep === step ? enabledStepButtonStyle : disabledStepButtonStyle}
                    >
                        Step {step}
                    </button>
                ))}
            </div>

            <div className="space-y-8">
                {currentStep === 1 &&  
                    !isInvoiceSelected ?
                    (<div className={cardStyle}>
                        <label className="block text-sm font-medium text-gray-700">Bill Copy</label>
                        <input
                          type="file"
                          name="billCopy"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className={fileSelectionButtonStyle}
                          required
                        />
                      </div>)
                    :
                    (<div>
                    <CustomerForm formData={formData?.customer} onChange={handleCustomerChange} />
                    <ItemsForm
                        items={formData.items}
                        onItemChange={handleItemChange}
                        onAddItem={handleAddItem}
                        onRemoveItem={handleRemoveItem}
                        // onFileChange={handleFileChange}
                    />
                    </div>)
                }

                {currentStep === 2 && (
                    <LogisticsForm
                        formData={formData?.logistics}
                        onInputChange={handleInputChange}
                        onChange={handleLogisticsChange}
                        // onFileChange={()=>{}}
                    />
                )}

                <div className="flex justify-between pt-4 border-t">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className={secondaryButtonStyle}
                        >
                            Previous
                        </button>
                    )}
                    {(currentStep < 2 && isInvoiceSelected) ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className={"ml-auto " + primaryButtonStyle}
                        >
                            Next
                        </button>
                    ) : isInvoiceSelected ? (
                        <button
                            type="submit"
                            className={"ml-auto " +  formSubmitButtonStyle }
                            onClick={handleSubmit}
                        >
                            Submit Order
                        </button>
                        ) : (<></>)
                    }
                </div>
            </div>
        </div>
    </div>
}