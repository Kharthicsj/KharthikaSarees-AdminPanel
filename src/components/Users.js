import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/users.css"; // Make sure to import the CSS file

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/full-users");
        if (response.status === 200) {
          setUsers(response.data);
          setTotalUsers(response.data.length);
          setFilteredUsers(response.data); // Initialize with all users
        } else {
          console.error("Failed to fetch users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(user =>
          Object.values(user).some(value =>
            String(value || "").toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    }
  }, [searchQuery, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="users-page">
      <div className="users-container">
        <h2 className="user-header">User Details</h2>
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
        ) : filteredUsers.length > 0 ? (
          <div className="table-container">
            <p>Total Users: {totalUsers}</p>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Phone Number</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={index + indexOfFirstUser + 1}>
                    <td>{index + indexOfFirstUser + 1}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.city}</td>
                    <td>{user.state}</td>
                    <td>{user.phonenumber}</td>
                    <td>{user.pincode}</td>
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
          <p>No user data found</p>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
