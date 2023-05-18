import React, { useEffect, useState } from 'react';
import { adminMainAPIUrl, adminProductAPIUrl } from '../../../config/config';
import { Link, useNavigate } from 'react-router-dom';
import { addNeccessaryClasses, adminFrontUsersPostFix } from '../../../helpers/adminHelper';

function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${adminMainAPIUrl}/users/getall`);
      const data = await response.json();
      setUsers(data);
    }
    fetchData();
    
    addNeccessaryClasses();
  }, []);

  const handleAddUserClick = () => {
    navigate(adminFrontUsersPostFix + '/add');
  };

  const handleEditUserClick = (id) => {
    if (id) {
      navigate(adminFrontUsersPostFix + '/edit/' + id);
    } else {
      alert('Something went wrong!');
    }
  };
  function formatDate(date_string) {
    const date = new Date(date_string);
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedDateArray = formattedDate.split(", ");
    const formattedDayArray = formattedDateArray[1].split(" ");
    const formattedDateString = formattedDayArray[1] + "-" + formattedDayArray[0].substring(0, 3) + "-" + formattedDateArray[2] + " " + formattedDateArray[0];
    return formattedDateString;
  }
  return (
    <div className='main-table-container content'>
      <h2>Users List</h2>
      <button onClick={handleAddUserClick}>Add User</button>
      {console.log(users)}
        {users && users.length > 0 ? 
        <>
            <div className='table-container mt-4'>
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Email Verification</th>
                        <th>Contact Verification</th>
                        <th>Role</th>
                        <th>Date Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.contact || "-"}</td>
                        <td style={user.is_email_verified ? {color: "#00bd00", fontWeight: "600"} : {color: "red", fontWeight: "600"}}>{user.is_email_verified ? "Verified" : "Not Verified"}</td>
                        <td style={user.is_mobile_verified ? {color: "#00bd00", fontWeight: "600"} : {color: "red", fontWeight: "600"}}>{user.is_mobile_verified ? "Verified" : "Not Verified"}</td>
                        <td style={{textTransform: "capitalize"}}>{user.role}</td>
                        <td>{formatDate(user.date_created)}</td>
                        <td style={user.is_active ? {color: "#00bd00", fontWeight: "600"} : {color: "red", fontWeight: "600"}}>{user.is_active ? "Active" : "Not Active"}</td>
                        <td>
                            <button onClick={() => handleEditUserClick(user._id)}>Edit</button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
        : <>
          <p>No Users found.</p>
        </>}
    </div>
  );
}

export default UserList;
