"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
// import { FaEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
// import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import {
  Button,
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
import Head from "next/head";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserManagement = () => {
  const [rowData, setRowData] = useState<any[]>([
    {
      userId: "U001",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      role: "Admin",
      status: true,
      dateAdded: "23/12/2024 6:30 PM",
      action: "action",
    },
    {
      userId: "U002",
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      role: "User",
      status: false,
      dateAdded: "24/12/2024 9:15 AM",
      action: "action",
    },
    {
      userId: "U003",
      name: "Anjali Gupta",
      email: "anjali.gupta@example.com",
      role: "Manager",
      status: true,
      dateAdded: "22/12/2024 5:45 PM",
      action: "action",
    },
    {
      userId: "U004",
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      role: "Admin",
      status: true,
      dateAdded: "21/12/2024 8:30 AM",
      action: "action",
    },
    {
      userId: "U005",
      name: "Neha Jain",
      email: "neha.jain@example.com",
      role: "User",
      status: false,
      dateAdded: "20/12/2024 4:00 PM",
      action: "action",
    },
    {
      userId: "U006",
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      role: "Admin",
      status: true,
      dateAdded: "19/12/2024 11:30 AM",
      action: "action",
    },
    {
      userId: "U007",
      name: "Divya Kapoor",
      email: "divya.kapoor@example.com",
      role: "Manager",
      status: true,
      dateAdded: "18/12/2024 2:45 PM",
      action: "action",
    },
    {
      userId: "U008",
      name: "Amit Malhotra",
      email: "amit.malhotra@example.com",
      role: "User",
      status: true,
      dateAdded: "17/12/2024 9:00 AM",
      action: "action",
    },
    {
      userId: "U009",
      name: "Simran Kaur",
      email: "simran.kaur@example.com",
      role: "Admin",
      status: false,
      dateAdded: "16/12/2024 1:20 PM",
      action: "action",
    },
    {
      userId: "U010",
      name: "Arjun Khanna",
      email: "arjun.khanna@example.com",
      role: "Manager",
      status: true,
      dateAdded: "15/12/2024 10:10 AM",
      action: "action",
    },
    {
      userId: "U011",
      name: "Kavita Roy",
      email: "kavita.roy@example.com",
      role: "User",
      status: false,
      dateAdded: "14/12/2024 6:50 PM",
      action: "action",
    },
    {
      userId: "U012",
      name: "Siddharth Chawla",
      email: "siddharth.chawla@example.com",
      role: "User",
      status: true,
      dateAdded: "13/12/2024 3:15 PM",
      action: "action",
    },
    {
      userId: "U013",
      name: "Megha Pandey",
      email: "megha.pandey@example.com",
      role: "Manager",
      status: false,
      dateAdded: "12/12/2024 8:00 AM",
      action: "action",
    },
    {
      userId: "U014",
      name: "Karan Oberoi",
      email: "karan.oberoi@example.com",
      role: "Admin",
      status: true,
      dateAdded: "11/12/2024 12:30 PM",
      action: "action",
    },
    {
      userId: "U015",
      name: "Pooja Sharma",
      email: "pooja.sharma@example.com",
      role: "User",
      status: true,
      dateAdded: "10/12/2024 5:20 PM",
      action: "action",
    },
    
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "userId",
      headerName: "User Id",
      filter: "agTextColumnFilter",
    },
    { field: "name", filter: true },
    { field: "email", headerName: "Email Id", filter: "agDateColumnFilter" },
    {field: "role", headerName: "Role", filter: "agDateColumnFilter"},
    { field: "status", headerName: "Access", filter: "agSetColumnFilter" },
    { field: "dateAdded", headerName: "Date Added", filter: "agTextColumnFilter" },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "12px", marginTop: "10px"}}>
          <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <CiEdit size={20} />
          </div>
          {/* <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <RiDeleteBin6Line size={20} />
          </div> */}
        </div>
      ),
    },
  ]);

  // const pagination = useMemo(() => {
  //   return {
  //     pagination: true,
  //     paginationPageSize: 4,
  //     paginationPageSizeSelector: [10, 20, 30, 40, 50],
  //   };
  // }, []);


  function handleEdit(data: any) {
    console.log(data);
  }

  // modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [password, setpassword] = useState("");
  const [role , setRole] = useState("")
  

  const [show, setShow] = React.useState(false);
  const handleClickpass = () => setShow(!show);

  const handleAddDevice = () => {
    const newDevice = {
      deviceId,
      deviceName,
      password,
      role,
    };
    console.log(newDevice);
    // Clear inputs and close modal (optional)
    setDeviceId("");
    setDeviceName("");
    setpassword("");
    setRole("")
    onClose();
  };

  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>User management</h3>
        <p>
          View/manage user accounts and configure roles for streamlined access
          control.
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
          <p style={{ fontSize: "16px", fontWeight: "600" }}>User management</p>
          <Button onClick={onOpen} colorScheme="green">
            Add New User
          </Button>
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter User Name"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
              />
              <FormLabel>Email ID</FormLabel>
              <Input
                placeholder="Enter Email Id"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
              <FormLabel>Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClickpass}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormLabel>Role</FormLabel>
              <Select
                placeholder="Select option"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAddDevice}>
              Add Device
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;
