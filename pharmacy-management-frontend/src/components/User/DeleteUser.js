import React, { useState } from "react";
import { Button, Input, notification, Modal } from "antd";
import { deleteUserById as deleteUser } from "../../api/user";

const DeleteUser = ({ onUserDeleted }) => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(userId);
      notification.success({
        message: "Success",
        description: "User deleted successfully!",
      });
      onUserDeleted();
      setUserId("");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete User"
      visible={true}
      onOk={handleDelete}
      onCancel={() => setUserId("")}
      confirmLoading={loading}
    >
      <Input
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
    </Modal>
  );
};

export default DeleteUser;
