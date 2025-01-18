import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { createUser } from "../../api/user";

const CreateUser = ({ onUserCreated }) => {
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await createUser(values);
      notification.success({
        message: "Success",
        description: "User created successfully!",
      });
      onUserCreated();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to create user.",
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
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Create User</h2>
        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter the first name" }]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter the last name" }]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[{ required: true, message: "Please enter the mobile number" }]}
          >
            <Input placeholder="Enter mobile number" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%", fontSize: "16px", padding: "10px" }}
          >
            Create User
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateUser;
