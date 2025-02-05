import React from "react";
import PositionCreate from "../../components/admin/position/PositionCreate";
import PositionTable from "../../components/admin/position/PositionTable";

const PositionManagement = () => {
  return (
    <section>
      <h1 className="text-2xl font-bold">จัดการตำแหน่ง</h1>
      <hr className="mb-3" />
      <PositionCreate />
      <PositionTable/>
    </section>
  );
};

export default PositionManagement;
