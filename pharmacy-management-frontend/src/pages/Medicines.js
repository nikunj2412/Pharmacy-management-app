import React, { useEffect, useState } from "react";
import { Table, Button, Spin, notification, Drawer, Modal } from "antd";
import { getAllMedicines } from "../api/admin";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { deleteMedicine } from "../api/medicine";
import CreateMedicine from "../components/Medicine/createMedicine";
import UpdateMedicine from "../components/Medicine/updateMedicine";
import moment from "moment"; // Import moment for date formatting

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false); // Drawer for creating medicine
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const navigate = useNavigate();

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await getAllMedicines(); // Fetch all medicines
      setMedicines(response.data || []); // Assuming `response.data` contains the medicine list
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch medicines",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines(); // Fetch medicines on component mount
  }, []);

  const handleAddMedicine = () => {
    setIsCreateDrawerVisible(true);
  };

  const handleEditMedicine = (medicine) => {
    setSelectedMedicine(medicine); // Set selected medicine for editing
    setIsUpdateModalVisible(true); // Open the update modal
  };

  const handleDeleteMedicine = async (medicineId) => {
    setLoading(true);
    try {
      await deleteMedicine(medicineId);
      notification.success({
        message: "Success",
        description: "Medicine deleted successfully",
      });
      fetchMedicines();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete medicine",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actual Price",
      dataIndex: "accualPrice",
      key: "accualPrice", // Display actual price
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry",
      key: "expiry",
      render: (expiry) => (expiry ? moment(expiry).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={() => handleEditMedicine(record)}
            style={{ marginRight: "10px" }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteMedicine(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Medicines</h2>

      <Button
        type="default"
        onClick={() => navigate("/dashboard")} // Navigate to dashboard
        style={{ marginBottom: "20px", marginRight: "10px" }}
      >
        Back
      </Button>

      <Button
        type="primary"
        onClick={handleAddMedicine}
        style={{ marginBottom: "20px" }}
      >
        Add Medicine
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={medicines}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Create Medicine Modal */}
      <Drawer
        title="Create Medicine"
        placement="right"
        width="100%" // Full-page width
        onClose={() => setIsCreateDrawerVisible(false)}
        visible={isCreateDrawerVisible}
      >
        <CreateMedicine
          onMedicineCreated={() => {
            fetchMedicines();
            setIsCreateDrawerVisible(false);
          }}
        />
        </Drawer>

      {/* Update Medicine Modal */}
      <Modal
        visible={isUpdateModalVisible}
        title="Update Medicine"
        footer={null}
        onCancel={() => setIsUpdateModalVisible(false)}
      >
        {selectedMedicine && (
          <UpdateMedicine
            key={selectedMedicine._id} // Ensure unique key for re-rendering
            medicine={selectedMedicine}
            onMedicineUpdated={() => {
              fetchMedicines();
              setIsUpdateModalVisible(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Medicines;
