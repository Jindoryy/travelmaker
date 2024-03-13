import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px",
  textAlign: "center",
};

export default Footer;
