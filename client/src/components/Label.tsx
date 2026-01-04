import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
}

const Label: React.FC<LabelProps> = ({ value, ...props }) => (
  <label {...props}>{value}</label>
);

export default Label;
