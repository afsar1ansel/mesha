"use client";

import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useState } from "react";
import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";


ModuleRegistry.registerModules([AllCommunityModule]);

const GridComponent = () => {
  const [rowData, setRowData] = useState<any[]>([
    {
      deviceId: "DMS12345",
      deviceName: "UPS Alpha-01",
      status: "Active",
      lastSync: "2025-01-10 10:30 AM",
      connectedUser: "John Doe",
      action: "Edit",
    },
    {
      deviceId: "DMS56789",
      deviceName: "UPS Beta-02",
      status: "Inactive",
      lastSync: "2025-01-09 03:20 PM",
      connectedUser: "Jane Smith",
      action: "Edit",
    },
    {
      deviceId: "DMS98765",
      deviceName: "UPS Gamma-03",
      status: "Active",
      lastSync: "2025-01-08 08:45 AM",
      connectedUser: "Mike Johnson",
      action: "Edit",
    },
    {
      deviceId: "DMS11223",
      deviceName: "UPS Delta-04",
      status: "Active",
      lastSync: "2025-01-07 02:15 PM",
      connectedUser: "Emily Davis",
      action: "Edit",
    },
    {
      deviceId: "DMS44556",
      deviceName: "UPS Epsilon-05",
      status: "Inactive",
      lastSync: "2025-01-06 09:00 AM",
      connectedUser: "Chris Brown",
      action: "Edit",
    },
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "deviceId",
      headerName: "Device ID",
      filter: "agTextColumnFilter",
    },
    { field: "deviceName", filter: true },
    { field: "lastSync", filter: "agDateColumnFilter" },
    { field: "status", filter: "agSetColumnFilter" },
    { field: "connectedUser", filter: "agTextColumnFilter" },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <FaEye size={20} />
          </div>
          <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <CiEdit size={20} />
          </div>
          <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <RiDeleteBin6Line size={20} />
          </div>
        </div>
      ),
    },
  ]);

  const pagination = useMemo(() => {
    return {
      pagination: true,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 30, 40, 50],
    };
  }, []);

  function handleEdit(data: any) {
    console.log(data);
  }


  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>Device Management</h3>
        <p>
          Monitor and manage all connected devices, update details, and ensure
          smooth operations with ease.
        </p>
      </div>
      <div style={{ height: "100%", width: "80vw", marginTop: "50px" }}>
        <div
          style={{
            height: "60px",
            width: "100%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px 10px 0px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4>Device Management</h4>
          <button>Add New Device</button>
        </div>
         <div style={{ height: "100%", width: "100%", maxWidth: "1250px" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          getRowHeight={function (params) {
            const description = params.data?.banner_description || "";
            const words = description.split(" ").length;
            const baseHeight = 80;
            const heightPerWord = 6;
            const minHeight = 80;
            const calculatedHeight = baseHeight + words * heightPerWord;
            return Math.max(minHeight, calculatedHeight);
          }}
        />
        </div>
      </div>
    </div>
  );
};

export default GridComponent;
