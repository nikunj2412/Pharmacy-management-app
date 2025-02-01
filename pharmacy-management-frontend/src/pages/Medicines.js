import React, { useEffect, useState } from "react";
import { Table, Button, Spin, notification, Drawer, Modal, Select, Input } from "antd";
import { getAllMedicines } from "../api/admin";
import { useNavigate } from "react-router-dom";
import { deleteMedicine } from "../api/medicine";
import CreateMedicine from "../components/Medicine/createMedicine";
import UpdateMedicine from "../components/Medicine/updateMedicine";
import moment from "moment";

const { Option } = Select;

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // Search input state

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await getAllMedicines();
      const medicineList = response.data || [];
      setMedicines(medicineList);
      setFilteredMedicines(medicineList); // Set filtered list initially
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch medicines",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setIsCreateDrawerVisible(true);
  };

  const handleEditMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setIsUpdateModalVisible(true);
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

  // 🔹 Handle Search (Dropdown & Typing)
  const handleSearchChange = (value) => {
    if (!value) {
      // If value is empty, reset filtered list to all medicines
      setSearchValue("");
      setFilteredMedicines(medicines);
      return;
    }
  
    setSearchValue(value);
    const filtered = medicines.filter((medicine) =>
      medicine?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMedicines(filtered);
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
      key: "accualPrice",
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
          <Button type="link" onClick={() => handleEditMedicine(record)} style={{ marginRight: "10px" }}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDeleteMedicine(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Medicines</h2>

      {/* 🔹 Search & Filter Section */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
      <Select
  showSearch
  placeholder="Search Medicine..."
  style={{ width: "300px" }}
  onChange={handleSearchChange}
  onSearch={handleSearchChange}
  value={searchValue}
  allowClear
>
  {medicines.map((medicine) => (
    <Option key={medicine._id} value={medicine.name}>
      {medicine.name}
    </Option>
  ))}
</Select>
      </div>

      <Button type="default" onClick={() => navigate("/dashboard")} style={{ marginBottom: "20px", marginRight: "10px" }}>
        Back
      </Button>

      <Button type="primary" onClick={handleAddMedicine} style={{ marginBottom: "20px" }}>
        Add Medicine
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={filteredMedicines} // Use filtered list instead of full list
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 5 }}
        />
      )}

      {/* Create Medicine Modal */}
      <Drawer
        title="Create Medicine"
        placement="right"
        width="100%"
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
      <Modal visible={isUpdateModalVisible} title="Update Medicine" footer={null} onCancel={() => setIsUpdateModalVisible(false)}>
        {selectedMedicine && (
          <UpdateMedicine
            key={selectedMedicine._id}
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
