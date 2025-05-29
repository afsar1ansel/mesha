"use client";

import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import styles from "./page.module.css";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Box,
  Flex,
  Grid,
  GridItem,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

ModuleRegistry.registerModules([AllCommunityModule]);

const AlertLogs = () => {
  // Form state
  const [formData, setFormData] = useState({
    voltage: {
      low: "",
      high: "",
    },
    current: {
      low: "",
      high: "",
    },
    temperature: {
      low: "",
      high: "",
    },
  });

  // Validation state
  const [errors, setErrors] = useState({
    voltageLow: "",
    voltageHigh: "",
    currentLow: "",
    currentHigh: "",
    temperatureLow: "",
    temperatureHigh: "",
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
              low: data[0].voltage_low?.toString() || "",
              high: data[0].voltage_high?.toString() || "",
            },
            current: {
              low: data[0].current_low?.toString() || "",
              high: data[0].current_high?.toString() || "",
            },
            temperature: {
              low: data[0].temp_low?.toString() || "",
              high: data[0].temp_high?.toString() || "",
            },
          });
        } else {
          console.log(
            "Error fetching alert log data:",
            data.message || "Failed to fetch alert log data"
          );
        }
      } catch (error) {
        console.log("Error fetching alert log data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertLogData();
  }, [toast]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      voltageLow: "",
      voltageHigh: "",
      currentLow: "",
      currentHigh: "",
      temperatureLow: "",
      temperatureHigh: "",
    };

    // Validate voltage low
    if (!formData.voltage.low.trim()) {
      newErrors.voltageLow = "Voltage low value is required";
      isValid = false;
    } else if (isNaN(Number(formData.voltage.low))) {
      newErrors.voltageLow = "Voltage low must be a number";
      isValid = false;
    }

    // Validate voltage high
    if (!formData.voltage.high.trim()) {
      newErrors.voltageHigh = "Voltage high value is required";
      isValid = false;
    } else if (isNaN(Number(formData.voltage.high))) {
      newErrors.voltageHigh = "Voltage high must be a number";
      isValid = false;
    } else if (Number(formData.voltage.high) <= Number(formData.voltage.low)) {
      newErrors.voltageHigh = "Voltage high must be greater than low value";
      isValid = false;
    }

    // Validate current low
    if (!formData.current.low.trim()) {
      newErrors.currentLow = "Current low value is required";
      isValid = false;
    } else if (isNaN(Number(formData.current.low))) {
      newErrors.currentLow = "Current low must be a number";
      isValid = false;
    }

    // Validate current high
    if (!formData.current.high.trim()) {
      newErrors.currentHigh = "Current high value is required";
      isValid = false;
    } else if (isNaN(Number(formData.current.high))) {
      newErrors.currentHigh = "Current high must be a number";
      isValid = false;
    } else if (Number(formData.current.high) <= Number(formData.current.low)) {
      newErrors.currentHigh = "Current high must be greater than low value";
      isValid = false;
    }

    // Validate temperature low
    if (!formData.temperature.low.trim()) {
      newErrors.temperatureLow = "Temperature low value is required";
      isValid = false;
    } else if (isNaN(Number(formData.temperature.low))) {
      newErrors.temperatureLow = "Temperature low must be a number";
      isValid = false;
    }

    // Validate temperature high
    if (!formData.temperature.high.trim()) {
      newErrors.temperatureHigh = "Temperature high value is required";
      isValid = false;
    } else if (isNaN(Number(formData.temperature.high))) {
      newErrors.temperatureHigh = "Temperature high must be a number";
      isValid = false;
    } else if (
      Number(formData.temperature.high) <= Number(formData.temperature.low)
    ) {
      newErrors.temperatureHigh =
        "Temperature high must be greater than low value";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    field: string,
    type: "low" | "high",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof formData],
        [type]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `${field}${type.charAt(0).toUpperCase() + type.slice(1)}`;
    if (errors[errorKey as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const payload = new FormData();
      payload.append("token", token);
      payload.append("voltage_low", formData.voltage.low);
      payload.append("voltage_high", formData.voltage.high);
      payload.append("current_low", formData.current.low);
      payload.append("current_high", formData.current.high);
      payload.append("temp_low", formData.temperature.low);
      payload.append("temp_high", formData.temperature.high);

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
            <FormLabel>Voltage</FormLabel>
            <Flex gap={2} mb={2}>
              <FormControl isInvalid={!!errors.voltageLow}>
                <Input
                  placeholder="Low Value"
                  value={formData.voltage.low}
                  onChange={(e) =>
                    handleInputChange("voltage", "low", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.voltageLow}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.voltageHigh}>
                <Input
                  placeholder="High Value"
                  value={formData.voltage.high}
                  onChange={(e) =>
                    handleInputChange("voltage", "high", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.voltageHigh}</FormErrorMessage>
              </FormControl>
            </Flex>
          </GridItem>

          {/* Current */}
          <GridItem>
            <FormLabel>Current</FormLabel>
            <Flex gap={2} mb={2}>
              <FormControl isInvalid={!!errors.currentLow}>
                <Input
                  placeholder="Low Value"
                  value={formData.current.low}
                  onChange={(e) =>
                    handleInputChange("current", "low", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.currentLow}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.currentHigh}>
                <Input
                  placeholder="High Value"
                  value={formData.current.high}
                  onChange={(e) =>
                    handleInputChange("current", "high", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.currentHigh}</FormErrorMessage>
              </FormControl>
            </Flex>
          </GridItem>

          {/* Temperature */}
          <GridItem>
            <FormLabel>Temperature</FormLabel>
            <Flex gap={2} mb={2}>
              <FormControl isInvalid={!!errors.temperatureLow}>
                <Input
                  placeholder="Low Value"
                  value={formData.temperature.low}
                  onChange={(e) =>
                    handleInputChange("temperature", "low", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.temperatureLow}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.temperatureHigh}>
                <Input
                  placeholder="High Value"
                  value={formData.temperature.high}
                  onChange={(e) =>
                    handleInputChange("temperature", "high", e.target.value)
                  }
                />
                <FormErrorMessage>{errors.temperatureHigh}</FormErrorMessage>
              </FormControl>
            </Flex>
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
    </div>
  );
};

export default AlertLogs;
