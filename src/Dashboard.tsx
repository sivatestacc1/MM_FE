// import React from "react";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import CreateNewOrder from "./components/CreateNewOrder";
import ListOfOrders from "./components/ListOfOrders";
import { CreateOrderFromInvoice } from "./components/CreateOrderFromInvoice";
import { fetchAllOrders } from "./hooks/ordersData";
import { ENDPOINT_URL } from "./constants";
import Loader from "./components/Loader";

function Dashboard() {
    const [showOrdersList, setShowOrdersList] = useState(false);
    const [showCreateOrderForm, setShowCreateOrderForm] = useState(false);
    const [showCreateOrderFromInvoice, setShowCreateOrderFromInvoice] = useState(false);
    const [isBEReady, setIsBEReady] = useState(false);
    useEffect(() => {
        if(!isBEReady) {
            checkBEConnection();
        }
    }, []);
    const checkBEConnection = () => {
        console.log("====> called check con ")
        setTimeout(() => {
            console.log("======> loop time")
            if(!isBEReady) {
                fetchListOfOrders();
            } else {
                return;
            }
        }, 2000);
    }
    const fetchListOfOrders = async () => {
            try {
                const response = await fetch(ENDPOINT_URL + "/api/orders")
                if (!response.ok) throw new Error('Failed to fetch orders');
                const data = await response.json();
                if(data?.length > 0) {
                    setIsBEReady(true);
                }
            } catch (err) {
                console.log("App is not ready...")
            }
    };
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <Package className="mx-auto h-12 w-12 text-blue-500" />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Management System</h1>
                </div>
                {!isBEReady && <Loader />}
                {isBEReady && <div>
                {((showOrdersList || showCreateOrderForm || showCreateOrderFromInvoice))&& <div className="container text-left pb-8">
                    <button
                            key={"back"}
                            onClick={() => {setShowOrdersList(false); setShowCreateOrderForm(false); setShowCreateOrderFromInvoice(false)}}
                            className={`flex-1 text-center py-2 mx-2 px-4 rounded-md bg-blue-500 text-white`}
                        >
                            Back
                    </button>
                </div>}

                <div className={`${!showOrdersList ? 'bg-white shadow-md rounded-lg p-6' : ''}`}>
                    {(!showCreateOrderForm && !showOrdersList && !showCreateOrderFromInvoice) && <div className="my-4 flex justify-between">
                        <h4 className="mt-2 text-1xl font-bold text-gray-900">Select Menu</h4>
                        <button
                            key={"orders"}
                            onClick={() => { setShowOrdersList(true);}}
                            className={`flex-1 text-center py-2 mx-2 rounded-md bg-yellow-300 text-red-600`}
                        >
                            View Orders
                        </button>
                        <button
                            key={"CreateUsingInvoice"}
                            onClick={() => {setShowCreateOrderFromInvoice(true)}}
                            className={`flex-1 text-center py-2 mx-2 rounded-md bg-yellow-300 text-red-600`}
                        >
                            Create Order Using Invoice
                        </button>
                        <button
                            key={"Create"}
                            onClick={() => {setShowCreateOrderForm(true)}}
                            className={`flex-1 text-center py-2 mx-2 rounded-md bg-yellow-300 text-red-600`}
                        >
                            Create New Order
                        </button>
                    </div>}
                    { showOrdersList && <div className="flex">
                        <ListOfOrders />
                    </div>}
                    { showCreateOrderFromInvoice && <div className="flex">
                        <CreateOrderFromInvoice />
                    </div>}
                    { showCreateOrderForm && <div className="flex">
                        <CreateNewOrder />
                    </div>}
                </div>
            </div>}
            </div>
        </div>
    );
}

export default Dashboard;