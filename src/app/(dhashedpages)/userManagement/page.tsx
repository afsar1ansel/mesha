"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import { toast, ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
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
  Stack,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";

ModuleRegistry.registerModules([AllCommunityModule]);

const UserManagement = () => {
  const [allRole, setAllRole] = useState<
    {
      id: number;
      modules_permitted: string;
      role_name: string;
      status: number;
    }[]
  >([]);

  const [users, setUsers] = useState<
    { email: string; id: number; role_name: string; username: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // const tok = sessionStorage.getItem("token");

  const tok =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  useEffect(() => {
    if (tok) {
      fetch(`https://bt.meshaenergy.com/apis/app-users/all-roles/${tok}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setAllRole(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (tok) {
      fetch(
        `https://bt.meshaenergy.com/apis/app-users/get-all-app-user/${tok}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "id",
      headerName: "User Id",
      filter: true,
    },
    { field: "username", headerName: "Name", filter: true },
    { field: "email", headerName: "Email Id", filter: true },
    { field: "role_name", headerName: "Role" },
    {
      field: "status",
      headerName: "Access",
      filter: true,
      cellRenderer: (params: any) => (
        <Switch
          colorScheme="green"
          onChange={handleToggle}
          defaultChecked={params.data.status}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      cellRenderer: (params: any) => (
        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <div
            onClick={() => handleEdit(params.data)}
            style={{ cursor: "pointer" }}
          >
            <CiEdit size={20} />
          </div>
        </div>
      ),
    },
  ]);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    console.log("Switch is:", newCheckedState);
  };

  function handleEdit(data: any) {
    console.log(data);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setuserId] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [password, setpassword] = useState("");
  const [role, setRole] = useState("");
  const [show, setShow] = React.useState(false);
  const handleClickpass = () => setShow(!show);

  const handleAdduser = () => {
    const newUser = {
      userId,
      userEmail,
      password,
      role,
    };

    const newUserData = new FormData();
    newUserData.append("username", userId);
    newUserData.append("email", userEmail);
    newUserData.append("password", password);
    newUserData.append("roleId", role);
   newUserData.append("token", tok ?? "");

    // console.log(Object.fromEntries(newUserData));

    fetch("https://bt.meshaenergy.com/apis/app-users/add", {
      method: "POST",
      body: newUserData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.errFlag === 0 ) {
          
          //reload the page here so the new data can reflect here 
        } else {
          toast.error(data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
    
   
    setuserId("");
    setuserEmail("");
    setpassword("");
    setRole("");
    onClose();
  };

// console.log(JSON.stringify(allRole, null, 2));
console.log(JSON.stringify(users, null, 2));

  

  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <ToastContainer position="top-right" autoClose={3000} />
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
            rowData={users}
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
                value={userId}
                onChange={(e) => setuserId(e.target.value)}
              />
              <FormLabel>Email ID</FormLabel>
              <Input
                placeholder="Enter Email Id"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
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
                {loading ? (
                  <option value="">Loading...</option>
                ) : (
                  allRole?.map((role, index) => (
                    <option key={index} value={role.id}>
                      {role.role_name}
                    </option>
                  ))
                )}
              </Select>
              <br />
              <FormLabel>Access To Screens</FormLabel>
              <CheckboxGroup colorScheme="green">
                <Stack direction="column">
                  <Checkbox value="1">Dashboard</Checkbox>
                  <Checkbox value="2">All users</Checkbox>
                  <Checkbox value="3">OTA Update</Checkbox>
                  <Checkbox value="4">Alert Logs</Checkbox>
                  <Checkbox value="5">User Role</Checkbox>
                </Stack>
              </CheckboxGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAdduser}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;
