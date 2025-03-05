"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { PiFileCsvDuotone } from "react-icons/pi";
import { GrFormView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import { FaRegCopy } from "react-icons/fa";
import { PiFilePdf } from "react-icons/pi";
import {
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { fetchExternalImage } from "next/dist/server/image-optimizer";
import { div } from "framer-motion/client";
import { toast, ToastContainer } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule]);

const DataLogs = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const [rowData, setRowData] = useState<any[]>([]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "customer_name",
      headerName: "Customer Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "username",
      headerName: "User Name",
      filter: "agTextColumnFilter",
    },
    {
      field: "device_id",
      headerName: "Device ID",
      filter: "agTextColumnFilter",
    },
    {
      field: "filename",
      headerName: "File Name",
      // maxWidth: 110,
    },
    {
      field: "upload_date",
      headerName: "Upload Date",
      maxWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: 110,
      cellRenderer: (params: any) => (
        <div style={{ color: params.data.status === 1 ? "green" : "red" }}>
          {params.data.status === 1 ? "Active" : "Inactilve"}
        </div>
      )
    },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: (params: any) => (
        // console.log(params.data),
        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <div style={{ cursor: "pointer" }}>
            <PiFileCsvDuotone
              size={20}
              onClick={() => downloadCSV(params.data.scanned_file_log_id)}
            />
          </div>
          {/* <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <GrFormView size={20} />
          </div> */}
          {/* <div
            // onClick={}
            style={{ cursor: "pointer" }}
          >
            <RiDeleteBin6Line size={20} />
          </div> */}
          <div
            onClick={() => handlePdfGen(params.data)}
            style={{ cursor: "pointer" }}
          >
            <PiFilePdf size={20} />
          </div>
        </div>
      ),
    },
  ]);

  //pdf
  const [pdfFilename, setPdfFilename] = useState("");
  async function handlePdfGen(data: any) {
    console.log("pdf", data);
    onLoadOpen(); // Open the modal

    const fileID = data.scanned_file_log_id.toString();
    console.log(fileID);
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const formVal = new FormData();
    formVal.append("scannedFileId", fileID);
    formVal.append("token", token || "");

    try {
      // Request PDF generation
      const response = await fetch(`${baseURL}/app/get-pdf-report`, {
        method: "POST",
        body: formVal,
      });

      const res = await response.json();
      console.log(res);

      if (res.pdfFileName) {
        await downloadPDf(res.pdfFileName);
      } else {
        console.error("No PDF filename received");
        toast.error(res.message || "Something Went Wrong Please Try Again");
      }
    } catch (error) {
      toast.error("Something Went Wrong Please Try Again");
      console.error("Error generating PDF:", error);
      onLoadClose();
    } finally {
      // Close the modal after 2 seconds
      setTimeout(() => {
        onLoadClose();
      }, 2000);
    }
  }

  async function downloadPDf(name: any) {
    try {
      const response = await fetch(`${baseURL}/pdf-report/${name}`, {
        method: "GET",
      });
      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = name || "report.pdf";
      link.click();
    } catch (error) {
      console.log(error);
    } finally {
      onLoadClose();
    }
  }

  //data fetch
  async function fetchData() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(
        `${baseURL}/app/reports/raw-data-logs/${token}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);
      setRowData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  //csv file
  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    return headers + rows;
  };

  // const [jsonData, setJsonData] = useState<any[]>([]);

  async function fetchjsonrawdata(number: any) {
    // console.log("datanumber", datanumber);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      const response = await fetch(
        `${baseURL}/app/reports/logged-values/${token}/${number}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      console.log(data);
      // setJsonData(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const downloadCSV = async (datanumber: any) => {
    const num = datanumber;
    const jsonData = await fetchjsonrawdata(num);

    const csvData = convertToCSV(jsonData);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isLoadOpen,
    onOpen: onLoadOpen,
    onClose: onLoadClose,
  } = useDisclosure();

  // const [isLoading, setIsLoading] = useState(false);

  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>Raw Data Logs</h3>
        <p>
          Access, monitor, and manage uploaded data logs with detailed
          processing history for better transparency and control.
        </p>
      </div>
      <div
        style={{
          height: "100%",
          width: "80vw",
          marginTop: "40px",
        }}
      >
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
          <p style={{ fontSize: "16px", fontWeight: "600" }}>
            Uploaded Data Logs
          </p>
          {/* <Button onClick={onOpen} colorScheme="green">
            Add New User
          </Button> */}
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
            paginationPageSizeSelector={[5, 10, 15]}
            paginationAutoPageSize={true}
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

      <Modal isOpen={isLoadOpen} onClose={onLoadClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Loading Data Please wait... </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress isIndeterminate color="green.300" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default DataLogs;
