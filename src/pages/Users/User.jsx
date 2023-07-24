import React, { useEffect, useState } from "react";
import toastr from "cogo-toast";
import axios from "axios";

const User = () => {
  const [users, setUsers] = useState([]);
  function getUsers() {
    const token = JSON.parse(localStorage.getItem("access_token"));
    console.log(token)
    const config = {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };
    return axios.get("f-home-be.vercel.app/getUser", config)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  //useEffect này giúp mỗi lần update trang sẽ get lại data ko cần reload trang
  useEffect(() => {
    getUsers()
      .then((data) => {
        // console.log(data.data.users); // in ra giá trị trả về
        setUsers(data.data.users);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  // const handlePutUser = (id) => {
  //   fetch(
  //     `https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/user-v1/${id}`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         status: true,
  //         roleName: "landlord",
  //       }),
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((result) => {
  //       // update state to re-render the component
  //       setUsers((prevData) => {
  //         const updatedData = prevData.map((item) => {
  //           if (item.id === result.id) {
  //             return result;
  //           } else {
  //             return item;
  //           }
  //         });
  //         return updatedData;
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  // const handleDeleteUser = (id) => {
  //   fetch(
  //     `https://63fc47ff677c41587308cabf.mockapi.io/api/v1/user/user-v1/${id}`,
  //     {
  //       method: "DELETE",
  //     }
  //   )
  //     .then((res) => res.json())
  //     .then((result) => {
  //       // update state to re-render the component
  //       setUsers((prevData) => {
  //         const filteredData = prevData.filter((item) => item.id !== id);
  //         return filteredData;
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header">
        <h4 className="card-title"> Users </h4>
        <button
          type="button"
          className="btn btn-primary btn-sm rounded-0 float-end"
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          data-bs-backdrop="static"
          onClick={getUsers}
        >
          Add User
        </button>
      </div>
      <div className="card-body">
        <div className="col-md-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th> Id </th>
                <th> Full Name </th>
                <th> Mobile No </th>
                <th> Email </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => handleSelectUser(user._id)}
                      checked={selectedUsers.includes(user._id)}
                    />
                  </td>
                  <td>{user._id}</td>
                  <td>
                    <img src={user.img} className="mx-10" />
                  </td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      // onClick={() => handlePutUser(user.id)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      // onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default User;
