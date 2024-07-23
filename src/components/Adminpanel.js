import React, { useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import Loading from "./Loading";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Styles/Panel.css";
import SubHeader from "./SubHeader"; // Import SubHeader if it's used in the component

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_REGION,
});

const bucketName = "kharthikasarees";
const folderName = "cotton";
const productDetailsFileName = "ProductDetails.json";

const AdminPanel = () => {
  const [files, setFiles] = useState([]);
  const[loadingText,setLoadingText] = useState("");
  const [folderNameInput, setFolderNameInput] = useState("");
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
  });
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
  });
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleInputChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteInputChange = (e) => {
    setDeleteId(e.target.value);
  };

  const handleDescriptionChange = (value) => {
    setProductData({
      ...productData,
      description: value,
    });
  };

  const handleEditDescriptionInputchange = (e) => {
    setEditData({
      ...editData,
      description: e,
    })
  }

  const handleFolderNameChange = (e) => {
    setFolderNameInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderNameInput) {
      alert("Please enter a folder name.");
      return;
    }

    setLoading(true);
    setLoadingText("Uploading");

    const s3 = new AWS.S3();
    const newFolderKey = `${folderName}/${folderNameInput}/`;

    try {
      await s3
        .putObject({
          Bucket: bucketName,
          Key: newFolderKey,
        })
        .promise();
      console.log("Folder created successfully");

      for (let file of files) {
        const fileKey = `${newFolderKey}${file.name}`;
        await s3
          .upload({
            Bucket: bucketName,
            Key: fileKey,
            Body: file,
            ContentType: file.type,
            ContentDisposition: "inline",
          })
          .promise();
        console.log(`Uploaded ${file.name} to ${fileKey}`);
      }

      const newProduct = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        description: productData.description,
        thumbnail: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[0].name}`,
        image1: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[0].name}`,
        image2: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[1].name}`,
        image3: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[2].name}`,
        image4: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[3].name}`,
        image5: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[4].name}`,
      };

      const productDetailsResponse = await axios.get(
        `https://${bucketName}.s3.eu-north-1.amazonaws.com/${folderName}/${productDetailsFileName}`
      );
      const productDetails = productDetailsResponse.data;

      productDetails.push(newProduct);

      await s3
        .putObject({
          Bucket: bucketName,
          Key: `${folderName}/${productDetailsFileName}`,
          Body: JSON.stringify(productDetails),
          ContentType: "application/json",
        })
        .promise();

      console.log("Product details updated successfully");

      setFiles([]);
      setFolderNameInput("");
      setProductData({
        id: "",
        name: "",
        price: "",
        description: "",
      });

      alert("Folder and product details uploaded successfully");
    } catch (error) {
      console.error("Error uploading folder to S3:", error);
      alert(
        "There was an error uploading the folder and product details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setLoadingText("Editing");


    const s3 = new AWS.S3();

    try {
      const productDetailsResponse = await axios.get(
        `https://${bucketName}.s3.eu-north-1.amazonaws.com/${folderName}/${productDetailsFileName}`
      );
      const productDetails = productDetailsResponse.data;

      const updatedProductDetails = productDetails.map((product) =>
        product.id === editData.id ? { ...product, ...editData } : product
      );

      await s3
        .putObject({
          Bucket: bucketName,
          Key: `${folderName}/${productDetailsFileName}`,
          Body: JSON.stringify(updatedProductDetails),
          ContentType: "application/json",
        })
        .promise();

      console.log("Product details updated successfully");

      setEditData({
        id: "",
        name: "",
        price: "",
        description: "",
      });

      alert("Product details updated successfully");
    } catch (error) {
      console.error("Error updating product details:", error);
      alert(
        "There was an error updating the product details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
    setLoadingText("Deleting");
  
    const s3 = new AWS.S3();
    const folderToDelete = `cotton/${deleteId}/`; // Ensure the correct path within cotton
  
    try {
      // Fetch and update JSON data
      const productDetailsResponse = await axios.get(
        `https://${bucketName}.s3.eu-north-1.amazonaws.com/${folderName}/${productDetailsFileName}`
      );
      const productDetails = productDetailsResponse.data;
  
      // Filter out the product to be deleted
      const updatedProductDetails = productDetails.filter(
        (product) => product.id !== deleteId
      );
  
      // Update JSON file in AWS S3 bucket
      await s3.putObject({
        Bucket: bucketName,
        Key: `${folderName}/${productDetailsFileName}`,
        Body: JSON.stringify(updatedProductDetails),
        ContentType: "application/json",
      }).promise();
  
      console.log("Product details updated successfully");
  
      // Delete the corresponding product folder
      await deleteFolder(folderToDelete);
  
      setDeleteId("");
      alert("Product and folder deleted successfully");
    } catch (error) {
      console.error("Error deleting product or folder:", error);
      alert(
        "There was an error deleting the product or folder. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to delete an entire folder
  const deleteFolder = async (folderPrefix) => {
    const s3 = new AWS.S3();
    let continuationToken = null;
  
    try {
      do {
        // List objects in the folder
        const listParams = {
          Bucket: bucketName,
          Prefix: folderPrefix,
          ContinuationToken: continuationToken,
        };
  
        const listedObjects = await s3.listObjectsV2(listParams).promise();
  
        if (listedObjects.Contents.length === 0) {
          console.log(`No objects found in folder ${folderPrefix}.`);
          break;
        }
  
        // Prepare delete parameters
        const deleteParams = {
          Bucket: bucketName,
          Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
          },
        };
  
        // Delete objects in the folder
        await s3.deleteObjects(deleteParams).promise();
        console.log(
          `Deleted objects: ${listedObjects.Contents.map(({ Key }) => Key).join(", ")}`
        );
  
        // Check if there are more objects to delete
        continuationToken = listedObjects.IsTruncated
          ? listedObjects.NextContinuationToken
          : null;
      } while (continuationToken);
  
      console.log(`Successfully deleted folder ${folderPrefix}`);
    } catch (error) {
      console.error(`Error deleting folder ${folderPrefix}:`, error);
    }
  };
      
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="form-container">
      <SubHeader activeTab={activeTab} />
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
          onClick={() => handleTabChange("upload")}
        >
          Upload
        </button>
        <button
          className={`tab-button ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => handleTabChange("edit")}
        >
          Edit
        </button>
        <button
          className={`tab-button ${activeTab === "delete" ? "active" : ""}`}
          onClick={() => handleTabChange("delete")}
        >
          Delete
        </button>
      </div>
      {loading ? (
        <Loading text={loadingText}/>
      ) : (
        <>
          {activeTab === "upload" && (
            <>
              <h2>Cotton Admin Panel</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="folderName">Folder Name:</label>
                  <input
                    type="text"
                    id="folderName"
                    placeholder="1xxxxx"
                    value={folderNameInput}
                    onChange={handleFolderNameChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="files">Upload Images:</label>
                  <input
                    type="file"
                    id="files"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div>
                  <label htmlFor="id">ID:</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={productData.id}
                    onChange={handleInputChange}
                    placeholder="1xxxxx"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price">Price:</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description">Description:</label>
                  <ReactQuill
                    value={productData.description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <button type="submit">Upload</button>
              </form>
            </>
          )}
          {activeTab === "edit" && (
            <>
              <h2>Edit Product Details</h2>
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label htmlFor="editId">Product ID:</label>
                  <input
                    type="text"
                    id="editId"
                    name="id"
                    value={editData.id}
                    onChange={handleEditInputChange}
                    placeholder="1xxxxx"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editName">Name:</label>
                  <input
                    type="text"
                    id="editName"
                    name="name"
                    value={editData.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editPrice">Price:</label>
                  <input
                    type="text"
                    id="editPrice"
                    name="price"
                    value={editData.price}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="editDescription">Description:</label>
                  <ReactQuill
                    value={editData.description}
                    onChange={handleEditDescriptionInputchange}
                    required
                  />
                </div>
                <button type="submit">Edit Product</button>
              </form>
            </>
          )}
          {activeTab === "delete" && (
            <>
              <h2>Delete Product</h2>
              <form onSubmit={handleDeleteSubmit}>
                <div>
                  <label htmlFor="deleteId">Product ID to delete:</label>
                  <input
                    type="text"
                    id="deleteId"
                    value={deleteId}
                    onChange={handleDeleteInputChange}
                    placeholder="1xxxx"
                    required
                  />
                </div>
                <button type="submit">Delete Product</button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
