import React, { useEffect, useState } from "react";
import { getAllUsers, getAllMedicines, getAllSales } from "../api/admin";
import { Card, Row, Col, Spin, notification, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const [userResponse, medicineResponse, salesResponse] = await Promise.all([
        getAllUsers(),
        getAllMedicines(),
        getAllSales(),
      ]);

      setUsersCount(userResponse.data.length || 0);
      setMedicinesCount(medicineResponse.data.length || 0);
      setSalesCount(salesResponse.data.length || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <Row justify="space-around" gutter={[16, 16]}>
          <Col>
            <Button type="link" onClick={() => navigate("/users")}>
              <strong>Users</strong>
            </Button>
          </Col>
          <Col>
            <Button type="link" onClick={() => navigate("/medicines")}>
              <strong>Medicines</strong>
            </Button>
          </Col>
          <Col>
            <Button type="link" onClick={() => navigate("/sales")}>
              <strong>Sales</strong>
            </Button>
          </Col>
        </Row>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title="Total Users" bordered>
              <h3>{usersCount}</h3>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Medicines" bordered>
              <h3>{medicinesCount}</h3>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Sales" bordered>
              <h3>{salesCount}</h3>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
