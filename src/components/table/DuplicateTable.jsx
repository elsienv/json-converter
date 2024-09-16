import React from 'react';

const DuplicateTable = ({ duplicateRows, columns }) => {
  return (
    <div>
      <h3>Duplikat Ditemukan:</h3>

      <table>
        <thead>
          <tr>
            {columns.map((columnName, index) => (
              <th key={index}>{columnName}</th>
            ))}
            <th>Baris</th>
          </tr>
        </thead>

        <tbody>
          {duplicateRows.map(({ row, index }, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((columnName, colIndex) => (
                <td key={colIndex}>{row[columnName]}</td>
              ))}
              <td>{index + 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DuplicateTable;
