import React, { useEffect, useState } from "react";
import { Table, Button, Modal, notification, Spin, Drawer } from "antd";
import { getAllUsers } from "../api/admin";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { deleteUserById } from "../api/user";
import CreateUser from "../components/User/createUser";
import UpdateUser from "../components/User/UpdateUser";
import { getSalesByUserId } from "../api/sales"; // Import API to fetch sales by user

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false); // Control for Create User Drawer
  const [salesModalVisible, setSalesModalVisible] = useState(false); // For Sales modal
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedSales, setSelectedSales] = useState([]); // To hold sales data for a user

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
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

  const handleCreateUser = () => {
    setDrawerVisible(true);
  };

  const handleUpdateUser = (userId) => {
    setSelectedUserId(userId);
    setIsUpdateModalVisible(true);
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

  const handleViewSales = (userId) => {
    fetchSalesByUser(userId); // Fetch sales by user and open modal
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewSales(record.id)}>
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
          <Button type="link" onClick={() => handleUpdateUser(record.id)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteUser(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const salesColumns = [
    {
      title: "Sales Number",
      dataIndex: "salesNumber",
      key: "salesNumber",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Medicines",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines) =>
        medicines.map((med) => (
          <div key={med.medicineId}>
            <strong>{med.medicineId?.name || "Unknown"}</strong> - Quantity: {med.Quantity}, Price per unit: ${med.price}
          </div>
        )),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Paid" : "Unpaid"),
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Users</h2>

      {/* Back Button */}
      <Button
        type="default"
        onClick={() => navigate("/dashboard")} // Navigate to dashboard
        style={{ marginBottom: "20px", marginRight: "10px" }}
      >
        Back
      </Button>

      <Button type="primary" onClick={handleCreateUser} style={{ marginBottom: "20px" }}>
        Add User
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={users}
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
        <UpdateUser
          userId={selectedUserId} // Pass selectedUserId as userId
          onUserUpdated={() => {
            fetchUsers();
            setIsUpdateModalVisible(false);
          }}
        />
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
          columns={salesColumns}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default Users;
