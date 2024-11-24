import React, { useState } from "react";
import { Modal as AntdModal, Form, message, Select, AutoComplete } from "antd";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const Modal = ({ open, setOpen, selectedData, type = "add" }) => {
  const [suggestions, setSuggestions] = useState([]); // State for AutoComplete options
  const [form] = Form.useForm(); // Create a form instance

  const hideModal = () => {
    form.resetFields(); // Reset fields when modal is closed
    setOpen(false);
  };

  const onFinish = async (values) => {
    const isBookmarkExists = suggestions.some(
      (item) => item.value.toLowerCase() === values.bookmark.toLowerCase()
    );

    if (isBookmarkExists) {
      message.error("This bookmark already exists!");
      return;
    }

    try {
      if (type === "add") {
        const data = { ...values, id: uuidv4() };
        const response = await axios.post(
          `https://sheetdb.io/api/v1/xst6grt6c9tow`,
          data
        );
        if (response.data) {
          message.success("Data added successfully!");
        } else {
          message.error("Failed to add data.");
        }
      } else if (type === "edit" && selectedData) {
        const data = { ...selectedData, ...values }; // Merge form values with existing data
        const response = await axios.patch(
          `https://sheetdb.io/api/v1/xst6grt6c9tow/id/${selectedData.id}`,
          data
        );
        if (response.data) {
          message.success("Data updated successfully!");
        } else {
          message.error("Failed to update data.");
        }
      } else {
        message.error("Invalid operation.");
      }
    } catch (error) {
      message.error("Error: " + error.message);
    }
    hideModal();
  };
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]); // Clear suggestions if input is empty
      return;
    }
    try {
      const response =
        await axios.get(`https://sheetdb.io/api/v1/3nh9gsmivu5e4?search=bookmark:${query}
    `);
      if (response.data && response.data.length > 0) {
        setSuggestions(
          response.data.map((item) => ({
            value: item.bookmark, // Map the "bookmark" field to AutoComplete options
          }))
        );
      } else {
        setSuggestions([
          { value: "No suggestions available", disabled: true }, // Display a message when no suggestions are found
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error.message);
      setSuggestions([
        { value: "Error fetching suggestions", disabled: true }, // Display an error message if API fails
      ]);
    }
  };

  return (
    <AntdModal
      title={type === "add" ? "Add Bookmark" : "Update Bookmark"}
      open={open}
      onCancel={hideModal}
      okText="Save"
      onOk={() => form.submit()} // Submit the form on clicking "Save"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedData}
      >
        <Form.Item
          label="Bookmark Name"
          name="bookmark"
          rules={[
            { required: true, message: "Please enter your Bookmark Name!" },
          ]}
        >
          <AutoComplete
            placeholder="Bookmark"
            onSearch={fetchSuggestions} // Fetch suggestions on input change
            options={suggestions} // Set suggestions as AutoComplete options
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Bookmark Type"
          name="type"
          rules={[{ required: true, message: "Please enter Bookmark Type" }]}
        >
          <Select placeholder="Select Bookmark Type">
            <Select.Option value="python">Python</Select.Option>
            <Select.Option value="java">Java</Select.Option>
            <Select.Option value="javascript">JavaScript</Select.Option>
            <Select.Option value="typescript">TypeScript</Select.Option>
            <Select.Option value="project">Project</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please enter Priority" }]}
        >
          <Select placeholder="Select Priority">
            <Select.Option value="important">Important</Select.Option>
            <Select.Option value="not-so">Not-so</Select.Option>
            <Select.Option value="urgent">Now</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </AntdModal>
  );
};
