import { useEffect, useState } from "react";
import { Order } from "../types";
import { OrderSummary } from "./OrderSummary";
import DatePickerInput from "./DataPickerInput";
import { format } from 'date-fns';
import { ENDPOINT_URL } from "../constants";

function ListOfOrders() {
    const [ordersData, setOrdersData] = useState<Order[]>([]);
    const [orderError, setOrderError] = useState<String|null>(null);
    const [orderLoading, setOrderLoading] = useState<Boolean>(true);
    const [showAOrder, setShowAOrder] = useState<Order>();
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        console.log("Data ", ordersData, orderError, orderLoading)
    },[ordersData, orderError, orderLoading]);

    useEffect(() => {
        fetchListOfOrdersByDate();
    }, [selectedDate]);

    const fetchListOfOrdersByDate = async () => {
        try {
            const response = await fetch(ENDPOINT_URL + "/api/orders/list-by-date",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({date: selectedDate.toISOString().replace("Z", "+00:00")}),
                    }
            )
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrdersData(JSON.parse(JSON.stringify(data)));
        } catch (err) {
            setOrderError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setOrderLoading(false);
        }
    };

    if(showAOrder) {
        const date = new Date(showAOrder?.orderDate);
        const dateString = date?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })

        return (
            <OrderSummary
            formData={showAOrder}
            orderNumber={showAOrder?.orderNumber}
            orderDate={new Date(dateString)}
            />
        );
    }

    return (
        <div className="container mx-auto">
            <DatePickerInput onSelectDate={(date: Date) => {setSelectedDate(date)}} />
            <div className="text-center mb-8">
                <h1 className="mt-4 text-2xl font-bold text-gray-900">{"List Of Orders - " + format(selectedDate, "dd MMM yyyy")}</h1>
            </div>
            <div className="p-0">
                <table className="table-auto w-full p-2">
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Order Date</th>
                            <th>Customer Details</th>
                            <th>Logistics Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {ordersData.map((order) => (
                            <tr key={order?.orderNumber} className="border border-gray-300 dark:border-gray-600">
                                <td className="p-4 ">{order?.orderNumber}</td>
                                <td>{new Date(order?.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td><p><b>{order?.customer?.name }</b><br />{ order?.customer?.address + "," + order?.customer?.city}<br />{ order?.customer?.state + " - " + order?.customer?.pincode} <br /> {order?.customer?.phone}</p></td>
                                <td><p><b>Parcel / Lorry Service Name: </b>{order?.logistics?.parcelServiceName}<br /> <b>Delivery Branch: </b>{ order?.logistics?.branch }</p></td>
                                <td><button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => {setShowAOrder(order)}}>View</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListOfOrders;