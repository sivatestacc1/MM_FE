import { useEffect, useState } from "react";
import { fetchAllOrders } from "../hooks/ordersData";
import { Order } from "../types";
import { OrderSummary } from "./OrderSummary";

function ListOfOrders() {
    const { orders, error, loading } = fetchAllOrders();
    const [showAOrder, setShowAOrder] = useState<Order>();

    useEffect(() => {
        console.log("Data ", orders, error, loading)
    },[orders, error, loading]);

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
            <div className="text-center mb-8">
                <h1 className="mt-4 text-2xl font-bold text-gray-900">List Of Orders</h1>
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
                        {orders.map((order) => (
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