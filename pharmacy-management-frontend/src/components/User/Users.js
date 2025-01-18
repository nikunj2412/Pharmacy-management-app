import React, { useState } from "react";
import { Tabs } from "antd";
import CreateUser from "../components/User/CreateUser";
import DeleteUser from "../components/User/DeleteUser";
import UpdateUser from "../components/User/UpdateUser";

const { TabPane } = Tabs;

const Users = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => setRefreshKey((prev) => prev + 1);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Create User" key="1">
        <CreateUser onUserCreated={refreshData} />
      </TabPane>
      <TabPane tab="Update User" key="2">
        <UpdateUser onUserUpdated={refreshData} />
      </TabPane>
      <TabPane tab="Delete User" key="3">
        <DeleteUser onUserDeleted={refreshData} />
      </TabPane>
    </Tabs>
  );
};

export default Users;
