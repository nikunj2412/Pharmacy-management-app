import React, { useEffect, useState } from "react";
import { Table, Button, Modal, notification, Spin, Drawer, Select, Input } from "antd";
import { getAllUsers } from "../api/admin";
import { useNavigate } from "react-router-dom";
import { deleteUserById } from "../api/user";
import CreateUser from "../components/User/createUser";
import UpdateUser from "../components/User/UpdateUser";
import { getSalesByUserId } from "../api/sales";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For search filter
  const [loading, setLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [salesModalVisible, setSalesModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedSales, setSelectedSales] = useState([]);
  const [searchValue, setSearchValue] = useState(""); // Store selected user search input

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []); // Set both lists initially
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesByUser = async (userId) => {
    setLoading(true);
    try {
      const response = await getSalesByUserId(userId);
      setSelectedSales(response.data || []);
      setSalesModalVisible(true);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch sales for the user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredUsers(users); // Reset to full list when input is cleared
      return;
    }
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await deleteUserById(userId);
      notification.success({
        message: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete user",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_, record) => (
        <Button type="link" onClick={() => fetchSalesByUser(record.id)}>
          {`${record.firstName} ${record.lastName}`}
        </Button>
      ),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => setSelectedUserId(record.id) || setIsUpdateModalVisible(true)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteUser(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      {/* Navigation Buttons */}
      <Button
        type="default"
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "20px", marginRight: "10px" }}
      >
        Back
      </Button>

      <Button type="primary" onClick={() => setDrawerVisible(true)} style={{ marginBottom: "20px" }}>
        Add User
      </Button>

      {/* Search Functionality */}
      <Select
        showSearch
        allowClear
        placeholder="Search by Name"
        style={{ width: "300px", marginBottom: "20px", display: "block" }}
        onSearch={handleSearchChange}
        onChange={handleSearchChange}
        value={searchValue || undefined}
      >
        {users.map((user) => (
          <Option key={user.id} value={`${user.firstName} ${user.lastName}`}>
            {user.firstName} {user.lastName}
          </Option>
        ))}
      </Select>

      {/* User Table */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Create User Modal */}
      <Drawer
        title="Create User"
        width="100%"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateUser
          onUserCreated={() => {
            fetchUsers();
            setDrawerVisible(false);
          }}
        />
      </Drawer>

      {/* Update User Modal */}
      <Modal
        title="Update User"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        {selectedUserId && (
          <UpdateUser
            userId={selectedUserId}
            onUserUpdated={() => {
              fetchUsers();
              setIsUpdateModalVisible(false);
            }}
          />
        )}
      </Modal>

      {/* Sales Modal */}
      <Modal
        title="Sales for User"
        visible={salesModalVisible}
        onCancel={() => setSalesModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={selectedSales}
          columns={[
            { title: "Total Price", dataIndex: "totalPrice", key: "totalPrice", render: (price) => `₹${price.toFixed(2)}` },
            { title: "Date", dataIndex: "date", key: "date", render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A") },
            {
              title: "Medicines",
              dataIndex: "medicines",
              key: "medicines",
              render: (medicines) =>
                medicines.map((med) => (
                  <div key={med.medicineId}>
                    <strong>{med.medicineId?.name || "Unknown"}</strong> - Quantity: {med.Quantity}, Price per unit: ₹{med.price}
                  </div>
                )),
            },
            { title: "Status", dataIndex: "status", key: "status", render: (status) => (status ? "Paid" : "Unpaid") },
          ]}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default Users;
