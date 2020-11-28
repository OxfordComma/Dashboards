import React from "react";

const Checkbox = ({ label, heading, isSelected, onCheckboxChange }) => (
  <div className="form-check">
    <label>
      <input
        type="checkbox"
        name={label}
        heading={heading}
        checked={isSelected}
        // value={label} 
        onChange={onCheckboxChange}
        className="form-check-input"
      />
      {label}
    </label>
  </div>
);

export default Checkbox;