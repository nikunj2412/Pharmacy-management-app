import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Form, Input, Select, DatePicker, Button, notification, Spin } from "antd";
import { updateSales, getSalesId } from "../../api/sales";
import { getAllUsers, getAllMedicines } from "../../api/admin";

const { Option } = Select;

const UpdateSales = ({ salesId, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch users",
      });
    }
  }, []);

  const fetchMedicines = useCallback(async () => {
    try {
      const response = await getAllMedicines();
      setMedicines(response.data || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch medicines",
      });
    }
  }, []);

  const fetchSalesData = useCallback(async () => {
    if (!salesId) {
      console.error("Sales ID is not provided to fetchSalesData.");
      return;
    }

    setLoading(true);
    try {
      const response = await getSalesId(salesId);
      if (response.data) {
        setInitialValues({
          userId: response.data.userId?._id || response.data.userId,
          userName: `${response.data.userId?.firstName || ""} ${response.data.userId?.lastName || ""}`,
          medicineName: response.data.medicines.map(
            (med) => `${med.medicineId?.name || "Unknown"} (Qty: ${med.Quantity})`
          ).join(", "),
          totalPrice: response.data.totalPrice,
          date: response.data.date ? moment(response.data.date) : null,
          status: response.data.status,
        });
      } else {
        notification.error({
          message: "Error",
          description: "No sales data found.",
        });
      }
    } catch (error) {
      console.error("Error fetching sales data:", error); // Debugging
      notification.error({
        message: "Error",
        description: "Failed to fetch sales data.",
      });
    } finally {
      setLoading(false);
    }
  }, [salesId]);

  useEffect(() => {
    fetchUsers();
    fetchMedicines();
    fetchSalesData();
  }, [fetchUsers, fetchMedicines, fetchSalesData]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        status: values.status,
      };
      await updateSales(salesId, payload);
      notification.success({
        message: "Success",
        description: "Sales status updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating sales:", error); // Debugging
      notification.error({
        message: "Error",
        description: error.message || "Failed to update sales record",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Sales Status</h2>
      {loading ? (
        <Spin size="large" />
      ) : initialValues ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
        >
          {/* Static User Field */}
          <Form.Item label="User">
            <Input value={initialValues.userName} disabled />
          </Form.Item>

          {/* Static Medicine Field */}
          <Form.Item label="Medicines">
            <Input value={initialValues.medicineName} disabled />
          </Form.Item>

          {/* Static Total Price Field */}
          <Form.Item label="Total Price">
            <Input value={`$${initialValues.totalPrice}`} disabled />
          </Form.Item>

          {/* Static Date Field */}
          <Form.Item label="Date">
            <DatePicker value={initialValues.date} style={{ width: "100%" }} disabled />
          </Form.Item>

          {/* Editable Status Field */}
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

          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Update Status
          </Button>
        </Form>
      ) : (
        <p>No sales data found</p>
      )}
    </div>
  );
};

export default UpdateSales;
