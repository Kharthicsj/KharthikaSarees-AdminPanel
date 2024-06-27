import React, { useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";
import Loading from "./Loading"; // Make sure Loading.js is in the same directory and exported properly
import "../Styles/Panel.css"; // Ensure your styles are correctly imported

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, 
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY, 
  region: process.env.REACT_APP_REGION,
});

const bucketName = "kharthikasarees";
const folderName = "Silkcotton";
const productDetailsFileName = "ProductDetails.json";

const Silkcotton = () => {
  const [files, setFiles] = useState([]);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
  });
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleInputChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFolderNameChange = (e) => {
    setFolderNameInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderNameInput) {
      alert("Please enter a folder name.");
      return;
    }

    setLoading(true); // Start loading

    const s3 = new AWS.S3();
    const newFolderKey = `${folderName}/${folderNameInput}/`;

    try {
      // Create folder in AWS S3 bucket by uploading an empty object
      await s3
        .putObject({
          Bucket: bucketName,
          Key: newFolderKey,
        })
        .promise();
      console.log("Folder created successfully");

      // Upload each file in the folder
      for (let file of files) {
        const fileKey = `${newFolderKey}${file.name}`;
        await s3
          .upload({
            Bucket: bucketName,
            Key: fileKey,
            Body: file,
            ContentType: file.type, // Set the content type based on the file type
            ContentDisposition: "inline", // Set content disposition to inline
          })
          .promise();
        console.log(`Uploaded ${file.name} to ${fileKey}`);
      }

      // Update JSON data with new product information
      const newProduct = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        description: productData.description,
        thumbnail: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[0].name}`, // Assuming first file is the thumbnail
        image1: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[0].name}`,
        image2: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[1].name}`,
        image3: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[2].name}`,
        image4: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[3].name}`,
        image5: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFolderKey}${files[4].name}`,
      };

      // Fetch existing JSON data from AWS S3 bucket
      const productDetailsResponse = await axios.get(
        `https://${bucketName}.s3.eu-north-1.amazonaws.com/${folderName}/${productDetailsFileName}`
      );
      const productDetails = productDetailsResponse.data;

      // Add new product to existing JSON data
      productDetails.push(newProduct);

      // Update JSON file in AWS S3 bucket
      await s3
        .putObject({
          Bucket: bucketName,
          Key: `${folderName}/${productDetailsFileName}`,
          Body: JSON.stringify(productDetails),
          ContentType: "application/json",
        })
        .promise();

      console.log("Product details updated successfully");

      // Reset form
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
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="form-container">
      {loading ? (
        <Loading />
      ) : (
        <>
          <h2>Silkcotton Admin Panel</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="folderName">Folder Name:</label>
              <input
                type="text"
                id="folderName"
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
                placeholder="5xxxxx"
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
              <textarea
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Silkcotton;
