import React, { useState } from "react";

const SpreadsheetDownloader = () => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(""); // Menyimpan link spreadsheet yang dimasukkan user
  const [selectedColumn, setSelectedColumn] = useState(""); // Menyimpan kolom yang dipilih user
  const [columns, setColumns] = useState([]); // Menyimpan daftar nama kolom yang dipilih user
  const [jsonData, setJsonData] = useState([]); // Menyimpan data dalam format JSON yang diambil dari spreadsheet
  const [duplicateRows, setDuplicateRows] = useState([]); // Menyimpan baris yang terduplikat
  const [filteredData, setFilteredData] = useState([]); // Menyimpan data yang sudah difilter

  const apiKey = "AIzaSyCyryvJvFTmpqMGb_SrSoSgMorMTlbf2VU"; // Ganti dengan API key dari Google Sheets API

  // Fungsi ketika user memasukkan link ke input
  const handleInputChange = (e) => {
    setSpreadsheetUrl(e.target.value);
  };

  // Fungsi ketika user klik tombol "Fetch Columns"
  const handleDownload = () => {
    if (spreadsheetUrl) {
      fetchSpreadsheet(spreadsheetUrl); // Memanggil fungsi untuk mengambil data dari spreadsheet
    } else {
      alert("Please enter a valid Google Spreadsheet link"); // Alert kalau user belum memasukkan link
    }
  };

  const fetchSpreadsheet = async (url) => {
    try {
      const spreadsheetId = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)[1];
      console.log("Fetching spreadsheet metadata...");

      // Ambil metadata spreadsheet untuk mengetahui sheet pertama
      const metadataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
      );

      if (!metadataResponse.ok) {
        throw new Error(`Error fetching spreadsheet metadata: ${metadataResponse.status}`);
      }

      const metadata = await metadataResponse.json();
      const sheetName = metadata.sheets[0].properties.title; // Ambil nama sheet pertama secara otomatis

      console.log(`Fetching data from sheet: ${sheetName}`);

      // Sekarang ambil data dari sheet pertama
      const dataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`
      );

      if (!dataResponse.ok) {
        throw new Error(`Error fetching sheet data: ${dataResponse.status}`);
      }

      const data = await dataResponse.json();
      const rows = data.values;

      if (rows.length > 0) {
        const header = rows[0]; // Baris pertama sebagai header
        const body = rows.slice(1); // Baris berikutnya sebagai data
        setColumns(header);
        const jsonData = body.map((row) =>
          Object.fromEntries(row.map((value, index) => [header[index], value]))
        );
        setJsonData(jsonData);
        setFilteredData(jsonData);
        findDuplicates(jsonData);
      } else {
        console.error("No data found in the spreadsheet.");
        alert("No data found in the spreadsheet.");
      }
    } catch (error) {
      console.error("Error fetching spreadsheet: ", error);
      alert(`Error fetching spreadsheet: ${error.message}`);
    }
  };

  const findDuplicates = (data) => {
    const jsonObject = {};
    const duplicates = [];

    data.forEach((row, index) => {
      const key = row["Message ID - Final"];
      if (jsonObject.hasOwnProperty(key)) {
        duplicates.push({ row, index });
      } else {
        jsonObject[key] = row;
      }
    });

    if (duplicates.length > 0) {
      window.alert(`Terdapat ${duplicates.length} baris yang duplikat!`);
      setDuplicateRows(duplicates);
    } else {
      window.alert("Tidak ada duplikat ditemukan.");
    }
  };

  const downloadJson = () => {
    if (filteredData.length === 0 || !selectedColumn) {
      alert("Data CSV belum tersedia atau kolom belum dipilih!");
      return;
    }

    const jsonObject = {};

    filteredData.forEach((row) => {
      const key = row["Message ID - Final"];
      const value = row[selectedColumn];
      if (key && value) {
        jsonObject[key] = value;
      }
    });

    const formattedJson = JSON.stringify(jsonObject, null, 2);

    const blob = new Blob([formattedJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "en.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("ini JSON", jsonObject);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Place Google Spreadsheet link here"
        value={spreadsheetUrl}
        onChange={handleInputChange}
      />
      <button onClick={handleDownload}>Fetch Columns</button>

      {columns.length > 0 && (
        <div>
          <select onChange={(e) => setSelectedColumn(e.target.value)}>
            <option value="">Pilih Kolom Value</option>
            {columns.map((column, index) => (
              <option key={index} value={column}>
                {column}
              </option>
            ))}
          </select>
          <button onClick={downloadJson}>Download as JSON</button>
        </div>
      )}

      {duplicateRows.length > 0 && (
        <div>
          <h3>Duplikat Ditemukan:</h3>
          <table>
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
                <th>Baris</th>
              </tr>
            </thead>
            <tbody>
              {duplicateRows.map(({ row, index }, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{row[column]}</td>
                  ))}
                  <td>{index + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SpreadsheetDownloader;
