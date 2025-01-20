import React from 'react';

interface InputProps {
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, value, onChange, className }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`border border-gray-300 p-2 rounded ${className}`}
    />
  );
};

export default Input;