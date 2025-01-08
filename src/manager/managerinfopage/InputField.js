import React from "react";
import "./InputField.css";

export const InputField = ({ label, type, value, onChange }) => (
  <div className="input-field">
    <label className="input-label">{label}</label>
    <input
      className="input-box"
      type={type}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export const Button = ({ onClick, children }) => (
  <button className="button" onClick={onClick}>
    {children}
  </button>
);
