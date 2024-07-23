import React from "react";
import "../Styles/SubHeader.css"; // Create a separate CSS file for styling

const SubHeader = ({ activeTab }) => {
  return (
    <div className="admin-subheader">
      <nav>
        <ul>
          <li className={activeTab === "upload" ? "active-link" : ""}>
            Upload
          </li>
          <li className={activeTab === "edit" ? "active-link" : ""}>
            Edit
          </li>
          <li className={activeTab === "delete" ? "active-link" : ""}>
            Delete
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SubHeader;
