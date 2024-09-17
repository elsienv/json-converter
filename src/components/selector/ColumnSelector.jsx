import React from 'react';

const ColumnSelector = ({ columns, selectedColumns, handleColumnChange }) => {
  return (
    <div>
      <h3>Pilih Kolom:</h3>
      {columns.map((columnName, index) => (
        <div key={index}>
          <input
            type="checkbox"
            value={columnName}
            checked={selectedColumns.includes(columnName)}
            onChange={handleColumnChange}
          />
          {columnName}
        </div>
      ))}
    </div>
  );
};

export default ColumnSelector;
