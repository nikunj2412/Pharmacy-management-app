import React, { useState, useEffect } from "react";
import { Form, Input, Button, notification } from "antd";
import { updateUser, getUserById } from "../../api/user";

const UpdateUser = ({ userId, onUserUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Ant Design's form instance
  const [userData, setUserData] = useState(null); // Store existing user data

  useEffect(() => {
    // Fetch user details by ID when userId changes
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await getUserById(userId);
        setUserData(response); // Store the user data
        form.setFieldsValue(response); // Populate form fields with fetched data
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message || "Failed to fetch user details.",
        });
      }
    };

    fetchUser();
  }, [userId, form]);

  const handleFinish = async (values) => {
    if (!userId) {
      notification.error({
        message: "Error",
        description: "User ID is not found.",
      });
      return;
    }

    // Merge existing user data with updated values
    const updatedData = { ...userData, ...values };

    setLoading(true);
    try {
      await updateUser(userId, updatedData); // Send the complete payload to backend
      notification.success({
        message: "Success",
        description: "User updated successfully!",
      });
      onUserUpdated();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update user.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <div>Loading...</div>; // Show a loading state until userData is fetched
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>Update User</h3>
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="First Name"
          name="firstName"
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
        >
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item
          label="Mobile Number"
          name="mobileNumber"
        >
          <Input placeholder="Mobile Number" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update User
        </Button>
      </Form>
    </div>
  );
};

export default UpdateUser;
