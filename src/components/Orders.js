import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/orders.css"; // Make sure to import the CSS file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order-table");
        if (response.status === 200) {
          setOrders(response.data);
          setTotalOrders(response.data.length);
          setFilteredOrders(response.data);
        } else {
          console.error("Failed to fetch orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search query
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(order =>
          Object.values(order).some(value =>
            String(value || "").toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }
  }, [searchQuery, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredOrders.length / ordersPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderItems = (items) => {
    if (Array.isArray(items)) {
      return items.map((item, index) => (
        <div key={index}>
          {item.name} ({item.price})
        </div>
      ));
    }
    return items;
  };

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      const response = await axios.put(`https://kharthikasarees-backend.onrender.com/api/order-status`, { transaction_id: transactionId, status: newStatus });
      if (response.status === 200) {
        setOrders(orders.map(order => order.transaction_id === transactionId ? { ...order, status: newStatus } : order));
        setFilteredOrders(filteredOrders.map(order => order.transaction_id === transactionId ? { ...order, status: newStatus } : order));
      } else {
        console.error("Failed to update order status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="users-page">
      <div className="users-container">
        <h2 className="user-header">Order Details</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : filteredOrders.length > 0 ? (
          <div className="table-container">
            <p>Total Orders: {totalOrders}</p>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Transaction ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Phone Number</th>
                  <th>Pincode</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Ordered Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={index + indexOfFirstOrder + 1}>
                    <td>{index + indexOfFirstOrder + 1}</td>
                    <td>{order.transaction_id}</td>
                    <td>{order.user_firstname}</td>
                    <td>{order.user_lastname}</td>
                    <td>{order.user_email}</td>
                    <td>{order.user_address}</td>
                    <td>{order.user_city}</td>
                    <td>{order.user_state}</td>
                    <td>{order.user_phonenumber}</td>
                    <td>{order.user_pincode}</td>
                    <td>{renderItems(order.items)}</td>
                    <td>{order.total}</td>
                    <td>{formatDate(order.order_date)}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.transaction_id, e.target.value)}
                      >
                        <option value="Order Successful">Order Successful</option>
                        <option value="Shipped">Shipped</option>
                        <option value="In-Transit">In-Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {pageNumbers.map(number => (
                <button key={number} onClick={() => paginate(number)}>
                  {number}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>No order data found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
