import React from 'react';

const ColumnSelector = ({ columns, selectedColumns, handleColumnChange }) => {
  return (
    <div>
      <h3>Pilih Kolom:</h3>
      {columns.map((column, index) => (
        <div key={index}>
          <input
            type="checkbox"
            value={column}
            checked={selectedColumns.includes(column)}
            onChange={handleColumnChange}
          />
          {column}
        </div>
      ))}
    </div>
  );
};

export default ColumnSelector;
