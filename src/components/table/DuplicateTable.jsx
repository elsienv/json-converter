import React from 'react'; 

// Komponen DuplicateTable menerima dua properti: duplicateRows dan columns.
const DuplicateTable = ({ duplicateRows, columns }) => {
  return (
    <div>
      <h3>Duplikat Ditemukan:</h3>

      <table>
        {/* Bagian tabel yang berisi header atau nama-nama kolom */}
        <thead>
          <tr>
            <th>Baris</th>
            {/* Map melalui array `columns` untuk membuat elemen <th> (header kolom) */}
            {columns.map((columnName, index) => (
              <th key={index}>{columnName}</th> // Setiap header kolom berisi nama kolom
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Map melalui array `duplicateRows` untuk membuat baris-baris tabel */}
          {duplicateRows.map(({ row, index }, rowIndex) => (
            <tr key={rowIndex}>              
              <td>{index + 1}</td> {/* Menampilkan nomor baris (berdasarkan index) */}
              {/* Untuk setiap baris, kita map lagi melalui nama-nama kolom */}
              {columns.map((columnName, colIndex) => (
                <td key={colIndex}>{row[columnName]}</td> // Menampilkan data di setiap kolom untuk baris tersebut
              ))}
              {/* Menambahkan sel tambahan yang menampilkan nomor baris dari spreadsheet asli */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DuplicateTable;
