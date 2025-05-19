import { useEffect, useState } from "react";
import { Order } from "../types";
import { ENDPOINT_URL } from "../constants";

export function fetchAllOrders() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        fetchListOfOrders();
    },[])

    const fetchListOfOrders = async () => {
        try {
            const response = await fetch(ENDPOINT_URL + "/api/orders")
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(JSON.parse(JSON.stringify(data)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    return {orders, error, loading};
}

export function fetchOrdersByDate(date: Date) {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        fetchListOfOrdersByDate();
    },[])

    const fetchListOfOrdersByDate = async () => {
        try {
            const response = await fetch(ENDPOINT_URL + "/api/orders",
                {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({date: date}),
                  }
            )
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(JSON.parse(JSON.stringify(data)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    return {orders, error, loading};
}