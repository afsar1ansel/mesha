"use client";

import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useMemo, useState } from "react";
import { HiDownload } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { ColDef } from "ag-grid-community";
import { IoReload } from "react-icons/io5";
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
  Box,
  Flex,
  Grid,
  GridItem,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

ModuleRegistry.registerModules([AllCommunityModule]);

const AlertLogs = () => {
  const [rowData, setRowData] = useState<any[]>([
    {
      fileName: "UPS_Data_20250108_001.csv",
      uploadDate: "23/12/2024",
      deviceName: "MESHA_001",
      status: "Processed",
      action: "action",
    },
  ]);

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "Sl. No",
      field: "index",
      maxWidth: 80,
      filter: false,
      suppressAutoSize: true,
    },
    {
      headerName: "Device ID",
      field: "Cycle",
      minWidth: 180,
    },
    {
      headerName: "Parameter",
      field: "b1",
    },
    {
      headerName: "Operation",
      field: "b2",
    },
    {
      headerName: "Value",
      field: "b3",
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    voltage: {
      type: "low",
      value: "",
    },
    current: {
      type: "low",
      value: "",
    },
    temperature: {
      type: "low",
      value: "",
    },
  });

  // Validation state
  const [errors, setErrors] = useState({
    voltage: "",
    current: "",
    temperature: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Fetch initial alert log data
  useEffect(() => {
    const fetchAlertLogData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `https://bt.meshaenergy.com/apis/alertLog/get/${token}`
        );
        const data = await response.json();
        console.log("Alert log data:", data);

        if (data.length > 0) {
          setFormData({
            voltage: {
              type: data[0].voltage_low_high_flag === 0 ? "low" : "high",
              value: data[0].voltage_th_value.toString(),
            },
            current: {
              type: data[0].current_low_high_flag === 0 ? "low" : "high",
              value: data[0].current_th_value.toString(),
            },
            temperature: {
              type: data[0].temp_low_high_flag === 0 ? "low" : "high",
              value: data[0].temp_th_value.toString(),
            },
          });
        } else {
          // toast({
          //   title: "Error",
          //   description: data.message || "Failed to fetch alert log data",
          //   status: "error",
          //   duration: 5000,
          //   isClosable: true,
          // });
          console.log(
            "Error fetching alert log data:",
            data.message || "Failed to fetch alert log data"
          );
        }
      } catch (error) {
        console.log("Error fetching alert log data:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch alert log data",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertLogData();
  }, [toast]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      voltage: "",
      current: "",
      temperature: "",
    };

    // Validate voltage
    if (!formData.voltage.value.trim()) {
      newErrors.voltage = "Voltage value is required";
      isValid = false;
    } else if (isNaN(Number(formData.voltage.value))) {
      newErrors.voltage = "Voltage must be a number";
      isValid = false;
    }

    // Validate current
    if (!formData.current.value.trim()) {
      newErrors.current = "Current value is required";
      isValid = false;
    } else if (isNaN(Number(formData.current.value))) {
      newErrors.current = "Current must be a number";
      isValid = false;
    }

    // Validate temperature
    if (!formData.temperature.value.trim()) {
      newErrors.temperature = "Temperature value is required";
      isValid = false;
    } else if (isNaN(Number(formData.temperature.value))) {
      newErrors.temperature = "Temperature must be a number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: string, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof formData],
        [key]: value,
      },
    }));

    // Clear error when user starts typing
    if (key === "value" && errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleGetAlertLogs = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields with valid values",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (!token) {
        throw new Error("No token found");
      }
      const payload = new FormData();
      // const payload = {
      //   token,
      //   voltage_low_high_flag: formData.voltage.type === "low" ? 0 : 1,
      //   voltage_th_value: formData.voltage.value,
      //   current_low_high_flag: formData.current.type === "low" ? 0 : 1,
      //   current_th_value: formData.current.value,
      //   temp_low_high_flag: formData.temperature.type === "low" ? 0 : 1,
      //   temp_th_value: formData.temperature.value,
      // };
      payload.append("token", token);
      payload.append(
        "voltage_low_high_flag",
        formData.voltage.type === "low" ? "0" : "1"
      );
      payload.append("voltage_th_value", formData.voltage.value);
      payload.append(
        "current_low_high_flag",
        formData.current.type === "low" ? "0" : "1"
      );
      payload.append("current_th_value", formData.current.value);
      payload.append(
        "temp_low_high_flag",
        formData.temperature.type === "low" ? "0" : "1"
      );
      payload.append("temp_th_value", formData.temperature.value);

      const response = await fetch(
        "https://bt.meshaenergy.com/apis/alertLog/add",
        {
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();
      console.log("Response data:", data);

      if (data.errFlag === 0) {
        toast({
          title: "Success",
          description: "Alert log parameters updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(
          data.message || "Failed to update alert log parameters"
        );
      }
    } catch (error) {
      console.error("Error updating alert log parameters:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update alert log parameters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  function handleEdit(data: any) {
    console.log(data);
  }

  return (
    <div style={{ width: "80vw", height: "60vh", maxWidth: "1250px" }}>
      <div className={styles.hello}>
        <h3>Alert Logs</h3>
        <p>
          Access, monitor, and manage uploaded data logs with detailed
          processing history for better transparency and control.
        </p>
      </div>

      {/* New Form Section */}
      <Box bg="white" p={4} borderRadius="md" boxShadow="sm" mt={4} width="40%">
        <Heading size="md" mb={4}>
          Alert Parameters
        </Heading>

        <Grid templateColumns="repeat(1, 1fr)" gap={6}>
          {/* Voltage */}
          <GridItem>
            <FormControl isInvalid={!!errors.voltage}>
              <FormLabel>Voltage</FormLabel>
              <Flex>
                <Select
                  value={formData.voltage.type}
                  onChange={(e) =>
                    handleInputChange("voltage", "type", e.target.value)
                  }
                  mr={2}
                >
                  <option value="low">Low</option>
                  <option value="high">High</option>
                </Select>
                <Input
                  placeholder="Th Value"
                  value={formData.voltage.value}
                  onChange={(e) =>
                    handleInputChange("voltage", "value", e.target.value)
                  }
                />
              </Flex>
              <FormErrorMessage>{errors.voltage}</FormErrorMessage>
            </FormControl>
          </GridItem>

          {/* Current */}
          <GridItem>
            <FormControl isInvalid={!!errors.current}>
              <FormLabel>Current</FormLabel>
              <Flex>
                <Select
                  value={formData.current.type}
                  onChange={(e) =>
                    handleInputChange("current", "type", e.target.value)
                  }
                  mr={2}
                >
                  <option value="low">Low</option>
                  <option value="high">High</option>
                </Select>
                <Input
                  placeholder="Th Value"
                  value={formData.current.value}
                  onChange={(e) =>
                    handleInputChange("current", "value", e.target.value)
                  }
                />
              </Flex>
              <FormErrorMessage>{errors.current}</FormErrorMessage>
            </FormControl>
          </GridItem>

          {/* Temperature */}
          <GridItem>
            <FormControl isInvalid={!!errors.temperature}>
              <FormLabel>Temperature</FormLabel>
              <Flex>
                <Select
                  value={formData.temperature.type}
                  onChange={(e) =>
                    handleInputChange("temperature", "type", e.target.value)
                  }
                  mr={2}
                >
                  <option value="low">Low</option>
                  <option value="high">High</option>
                </Select>
                <Input
                  placeholder="Th Value"
                  value={formData.temperature.value}
                  onChange={(e) =>
                    handleInputChange("temperature", "value", e.target.value)
                  }
                />
              </Flex>
              <FormErrorMessage>{errors.temperature}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          mt={6}
          colorScheme="blue"
          width={"100%"}
          onClick={handleGetAlertLogs}
          isLoading={isLoading}
          loadingText="Submitting..."
        >
          Save Config
        </Button>
      </Box>

      {/* <div
        style={{
          height: "100%",
          width: "80vw",
          marginTop: "20px",
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
          <p style={{ fontSize: "16px", fontWeight: "600" }}>Alert Logs</p>
        </div>
        <div className={styles.vLowAndHigh}>
          <h5>Voltage Range : </h5>
          <p>
            B1: L <span id="v1Low">10</span> - H <span id="v1High">12</span>
          </p>
          <p>
            B2: L <span id="v2Low">12</span> - H <span id="v2High">15</span>
          </p>
          <p>
            B3: L <span id="v3Low">15</span> - H <span id="v3High">20</span>
          </p>
          <p>
            B4: L <span id="v4Low">20</span> - H <span id="v4High">22</span>
          </p>
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
      </div> */}
    </div>
  );
};

export default AlertLogs;
