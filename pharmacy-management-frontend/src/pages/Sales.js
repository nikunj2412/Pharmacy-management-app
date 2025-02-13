import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, notification, Spin, Drawer, Modal, Select } from "antd";
import { getAllSales } from "../api/admin";
import { deleteSalesById as deleteSales } from "../api/sales";
import CreateSales from "../components/Sales/createSales";
import UpdateSales from "../components/Sales/updateSales";
import { generateSalesPDF } from "../utils/pdfGenerator";
import SalesPDF from "../components/salesPDF";

const { Option } = Select;

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]); // Filtered data
  const [loading, setLoading] = useState(false);
  const [isCreateDrawerVisible, setIsCreateDrawerVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedSalesId, setSelectedSalesId] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [selectedSalesData, setSelectedSalesData] = useState(null);
  const [searchValue, setSearchValue] = useState(""); // Store selected user search input

  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await getAllSales();
      const salesData = response.data || [];
      setSales(salesData);
      setFilteredSales(salesData); // Initially, filtered data = all data
      setInvoiceNumber(1 + salesData.length);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch sales",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle search filter
  const handleSearchChange = (value) => {
    setSearchValue(value);
    if (!value) {
      setFilteredSales(sales); // Reset to full list when input is cleared
      return;
    }
    const filtered = sales.filter((sale) =>
      `${sale.userId?.firstName} ${sale.userId?.lastName}`
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredSales(filtered);
  };

  // 🔹 Handle PDF Download
  const handleDownloadHTMLPDF = (salesData) => {
    setSelectedSalesData(salesData);
    setTimeout(() => {
      generateSalesPDF(salesData, salesData.invoiceNumber);
    }, 500);
  };

  // 🔹 Open Create Sales Drawer
  const handleCreateSales = () => {
    setIsCreateDrawerVisible(true);
  };

  // 🔹 Open Update Sales Modal
  const handleUpdateSales = (salesId) => {
    setSelectedSalesId(salesId);
    setIsUpdateModalVisible(true);
  };

  // 🔹 Delete Sales Record
  const handleDeleteSales = async (salesId) => {
    setLoading(true);
    try {
      await deleteSales(salesId);
      notification.success({
        message: "Success",
        description: "Sales record deleted successfully",
      });
      fetchSales();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete sales record",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Table Columns
  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (_, record, index) => record.invoiceNumber || 1 + index,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (userId) => (userId ? `${userId.firstName} ${userId.lastName}` : "N/A"),
    },
    {
      title: "Medicines",
      dataIndex: "medicines",
      key: "medicines",
      render: (medicines) =>
        medicines.map((medicine) => `${medicine.medicineId?.name} (x${medicine.Quantity})`).join(", "),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Paid" : "Unpaid"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleUpdateSales(record.id)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDeleteSales(record.id)}>Delete</Button>
          <Button type="link" onClick={() => handleDownloadHTMLPDF(record)}>Download PDF</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sales</h2>

      {/* Navigation Buttons */}
      <Button type="default" onClick={() => navigate("/dashboard")} style={{ marginBottom: "20px", marginRight: "10px" }}>
        Back
      </Button>

      <Button type="primary" onClick={handleCreateSales} style={{ marginBottom: "20px" }}>
        Add Sales
      </Button>

      {/* Search Dropdown */}
      <Select
        showSearch
        allowClear
        placeholder="Search by User Name"
        style={{ width: "300px", marginBottom: "20px", display: "block" }}
        onSearch={handleSearchChange}
        onChange={handleSearchChange}
        value={searchValue || undefined}
      >
        {sales.map((sale) => (
          <Option key={sale.id} value={`${sale.userId?.firstName} ${sale.userId?.lastName}`}>
            {sale.userId?.firstName} {sale.userId?.lastName}
          </Option>
        ))}
      </Select>

      {/* Sales Table */}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={filteredSales} columns={columns} rowKey={(record) => record.id} pagination={{ pageSize: 5 }} />
      )}

      {/* Create Sales Drawer */}
      <Drawer
        title="Create Sales"
        placement="right"
        onClose={() => setIsCreateDrawerVisible(false)}
        visible={isCreateDrawerVisible}
        width="100%"
        bodyStyle={{ padding: "20px" }}
      >
        <CreateSales
          onSuccess={() => {
            fetchSales();
            setIsCreateDrawerVisible(false);
          }}
        />
      </Drawer>

      {/* Update Sales Modal */}
      <Modal
        title="Update Sales"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <UpdateSales
          salesId={selectedSalesId}
          onSuccess={() => {
            fetchSales();
            setIsUpdateModalVisible(false);
          }}
        />
      </Modal>

      {/* Hidden SalesPDF component for HTML PDF Generation */}
      {selectedSalesData && <SalesPDF salesData={selectedSalesData} invoiceNumber={invoiceNumber} />}
    </div>
  );
};

export default Sales;
