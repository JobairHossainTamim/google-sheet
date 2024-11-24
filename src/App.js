import { useEffect, useState } from "react";
import "./App.css";
import { Button, Input, Table, message } from "antd";
import { Modal } from "./components/Modal";
import axios from "axios";
import { DeleteFilled, EditOutlined } from "@ant-design/icons";
const { Search } = Input;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const showModal = () => setIsModalOpen(true);

  // Get Table Data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]); // Filtered data for display

  const onSearch = (value) => {
    const searchTerm = value.toLowerCase(); // Convert search input to lowercase for case-insensitive matching
    const filtered = data.filter(
      (item) =>
        item.bookmark.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.priority.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered); // Update filtered data
  };

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://sheetdb.io/api/v1/xst6grt6c9tow?_formate=index"
      );

      if (response.data) {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
        // Store the data in the state
      }
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch bookmarks: " + error.message);
    }
  };

  // delete

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `https://sheetdb.io/api/v1/xst6grt6c9tow/id/${id}`
      );

      if (response.data) {
        message.success("Data Delete successfully!");
        fetchBookmarks();
      }
    } catch (error) {
      message.error("Error during deletion: " + (error.message || error));
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Define table columns
  const columns = [
    {
      title: "Bookmark",
      dataIndex: "bookmark",
      key: "bookmark",
      render: (text) => <a href={text}>{text}</a>, // Render as a clickable link
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },

    {
      title: "Action",
      render: (_, record) => (
        <div className="flex gap-2">
          <EditOutlined
            onClick={() => {
              setSelectedData(record);
              setIsModalOpen(true);
            }}
          />

          <DeleteFilled
            onClick={() => {
              handleDelete(record.id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-full overflow-x-auto mx-auto">
      <div className="container mx-auto">
        <div className="mt-10 flex items-center justify-between w-full">
          <div className="w-1/2">
            <Search
              placeholder="Input Text Search"
              allowClear
              onSearch={onSearch}
              style={{
                width: 400,
              }}
            />
          </div>
          <Button type="primary" size="large" onClick={showModal}>
            Add Data
          </Button>
        </div>
        <div className="mt-5">
          <Table
            dataSource={filteredData}
            columns={columns}
            loading={loading}
            rowKey={(record) => record.id || record.bookmark}
            pagination={{
              pageSize: 10, // Number of rows per page
              showSizeChanger: true, // Allow changing page size
              pageSizeOptions: ["10", "20", "30", "40", "50"], // Options for page size
              showQuickJumper: true, // Allow quick navigation to specific pages
            }}
          />
        </div>

        {/*  */}

        <Modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          selectedData={selectedData}
          type={selectedData ? "edit" : "add"}
        />
      </div>
    </div>
  );
}

export default App;
