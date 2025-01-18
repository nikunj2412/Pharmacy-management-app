import React, { useEffect, useState } from "react";
import { getSalesByUserId } from "../../api/sales";
import { Table, notification, Spin } from "antd";

const SalesByUser = ({ userId }) => {
  const [sales, setSales] = useState([]); // Sales data
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    if (userId) {
      fetchSales(userId);
    }
  }, [userId]);

  const fetchSales = async (userId) => {
    setLoading(true);
    try {
      const response = await getSalesByUserId(userId);
      const salesData = response.results || []; // Adjusted based on API response
      setSales(salesData);
      notification.success({
        message: "Success",
        description: "Sales records fetched successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.error || "Failed to fetch sales records.",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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
        medicines.map((medicine) => (
          <div key={medicine.medicineId}>
            <strong>{medicine.medicineId?.name || "Unknown"}</strong> - Quantity:{" "}
            {medicine.Quantity}, Price per unit: ${medicine.price}
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

  return loading ? (
    <Spin size="large" />
  ) : (
    <Table
      dataSource={sales}
      columns={columns}
      rowKey={(record) => record._id}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default SalesByUser;
