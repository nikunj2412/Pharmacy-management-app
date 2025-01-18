import React, { useState } from "react";
import { Form, Input, InputNumber, Button, DatePicker, notification } from "antd";
import { createMedicine } from "../../api/medicine"; // Create API function

const CreateMedicine = ({ onMedicineCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formattedValues = {
        ...values,
        expiry: values.expiry.toISOString(),
      };
      await createMedicine(formattedValues);
      notification.success({
        message: "Success",
        description: "Medicine created successfully!",
      });
      onMedicineCreated();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to create medicine.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh", // Full viewport height
        backgroundColor: "#f4f4f4",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", width: "100%" }}>
        Create Medicine
      </h2>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        style={{
          width: "100%",
          maxWidth: "1200px", // Optional: Control max width
          background: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the medicine name" }]}
        >
          <Input placeholder="Enter medicine name" />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="Quantity"
          rules={[{ required: true, message: "Please enter the quantity" }]}
        >
          <InputNumber placeholder="Enter quantity" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber placeholder="Enter price" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Actual Price"
          name="accualPrice"
          rules={[{ required: true, message: "Please enter the actual price" }]}
        >
          <InputNumber placeholder="Enter actual price" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiry"
          rules={[{ required: true, message: "Please select the expiry date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: "100%", fontSize: "16px", padding: "10px" }}
        >
          Create Medicine
        </Button>
      </Form>
    </div>
  );
};

export default CreateMedicine;
