import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, notification, Spin } from "antd";
import { createSales } from "../../api/sales";
import { getAllUsers, getAllMedicines } from "../../api/admin";
// import { generatePDF } from "../../utils/pdfUtils"; // Import the generatePDF utility

const { Option } = Select;

const CreateSales = ({ onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchMedicines();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch users",
      });
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await getAllMedicines();
      setMedicines(response.data || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch medicines",
      });
    }
  };

  const handleMedicinesChange = (selectedIds) => {
    const selected = selectedIds.map((id) => {
      const medicine = medicines.find((med) => med.id === id);
      return {
        medicineId: id,
        name: medicine?.name || "Unknown",
        price: medicine?.price || 0,
        Quantity: 1,
      };
    });
    setSelectedMedicines(selected);
  };

  const handleQuantityChange = (index, value) => {
    const updatedMedicines = [...selectedMedicines];
    updatedMedicines[index].Quantity = value;
    setSelectedMedicines(updatedMedicines);
  };

  const calculateTotalPrice = () => {
    return selectedMedicines.reduce(
      (total, med) => total + med.price * med.Quantity,
      0
    );
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        userId: values.userId,
        medicines: selectedMedicines.map(({ medicineId, Quantity, price }) => ({
          medicineId,
          Quantity,
          price,
        })),
        totalPrice: calculateTotalPrice(),
        date: values.date.format("YYYY-MM-DD"),
        status: values.status,
      };

      await createSales(payload);
      notification.success({
        message: "Success",
        description: "Sales record created successfully",
      });

      // Generate PDF
      const salesData = {
        userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
        mobileNumber: selectedUser.mobileNumber,
        medicines: selectedMedicines,
        totalPrice: calculateTotalPrice(),
      };
      // generatePDF(salesData);

      form.resetFields();
      setSelectedMedicines([]);
      onSuccess();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.error || "Failed to create sales record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create Sales</h2>
        {loading ? (
          <Spin size="large" />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={(changedValues) => {
              if (changedValues.userId) {
                setSelectedUser(users.find((u) => u.id === changedValues.userId));
              }
            }}
          >
            <Form.Item
              name="userId"
              label="User"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select placeholder="Select a user">
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="medicines"
              label="Medicines"
              rules={[{ required: true, message: "Please select medicines" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select medicines"
                onChange={handleMedicinesChange}
              >
                {medicines.map((medicine) => (
                  <Option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedMedicines.map((medicine, index) => (
              <div key={medicine.medicineId} style={{ marginBottom: "10px" }}>
                <strong>{medicine.name}</strong>
                <Form.Item label="Quantity">
                  <Input
                    type="number"
                    min={1}
                    value={medicine.Quantity}
                    onChange={(e) =>
                      handleQuantityChange(index, Number(e.target.value))
                    }
                  />
                </Form.Item>
                <p>Price per unit: ${medicine.price}</p>
              </div>
            ))}

            <h3>Total Price: ${calculateTotalPrice()}</h3>

            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select status">
                <Option value={true}>Paid</Option>
                <Option value={false}>Unpaid</Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", fontSize: "16px", padding: "10px" }}
            >
              Create Sales
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CreateSales;
