import React, { useState } from "react";
import ColumnSelector from "./selector/ColumnSelector"; // Komponen untuk memilih kolom
import DuplicateTable from "./table/DuplicateTable"; // Komponen untuk menampilkan tabel baris duplikat
import Button from "./button/Button"; // Komponen tombol yang digunakan
import Input from "./input/Input"; // Komponen input yang digunakan untuk memasukkan URL
import { downloadJsonOrZip } from "../utils/downloadUtils"; // Utilitas untuk mengunduh file dalam format JSON atau ZIP

const SpreadsheetDownloader = () => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(""); // Menyimpan URL spreadsheet
  const [selectedColumns, setSelectedColumns] = useState([]); // Menyimpan daftar kolom yang dipilih user
  const [columns, setColumns] = useState([]); // Menyimpan daftar nama kolom (header) dari spreadsheet
  const [jsonData, setJsonData] = useState([]); // Menyimpan seluruh data spreadsheet dalam format JSON
  const [duplicateRows, setDuplicateRows] = useState([]); // Menyimpan daftar baris yang terdeteksi duplikat
  const [filteredData, setFilteredData] = useState([]); // Menyimpan data yang difilter berdasarkan kolom yang dipilih

  const apiKey = "AIzaSyCyryvJvFTmpqMGb_SrSoSgMorMTlbf2VU"; // API key untuk akses Google Sheets API

  // Fungsi untuk menangani perubahan pada input field
  const handleInputChange = (e) => {
    setSpreadsheetUrl(e.target.value); // Menyimpan URL yang diinput user ke dalam state spreadsheetUrl
  };

  // Fungsi yang dipanggil saat tombol download ditekan
  const handleDownload = () => {
    if (spreadsheetUrl) {
      fetchSpreadsheet(spreadsheetUrl); // Memanggil fungsi untuk mengambil data dari URL spreadsheet
    } else {
      alert("Please enter a valid Google Spreadsheet link"); // Memberikan peringatan jika URL kosong
    }
  };

  // Fungsi untuk mengambil data spreadsheet dari Google Sheets API
  const fetchSpreadsheet = async (url) => {
    try {
      const spreadsheetId = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)[1]; // Ekstrak ID spreadsheet dari URL

      // Ambil metadata dari spreadsheet
      const metadataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${apiKey}`
      );
      const metadata = await metadataResponse.json();
      const sheetName = metadata.sheets[0].properties.title; // Ambil nama sheet pertama

      // Ambil data dari spreadsheet
      const dataResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${apiKey}`
      );
      const data = await dataResponse.json();
      const rows = data.values; // Menyimpan semua baris dari sheet

      if (rows.length > 0) {
        const header = rows[0]; // Baris pertama sebagai header (kolom)
        const body = rows.slice(1); // Baris setelah header sebagai data

        setColumns(header); // Simpan header (kolom) ke dalam state columns
        const jsonData = body.map((row) =>
          Object.fromEntries(row.map((value, index) => [header[index], value]))
        );
        setJsonData(jsonData); // Simpan data sebagai JSON ke dalam state jsonData
        setFilteredData(jsonData); // Simpan data JSON ke dalam state filteredData
        findDuplicates(jsonData); // Panggil fungsi untuk menemukan duplikat dalam data
      } else {
        alert("No data found in the spreadsheet."); // Berikan peringatan jika tidak ada data dalam spreadsheet
      }
    } catch (error) {
      alert(`Error fetching spreadsheet: ${error.message}`); // Menampilkan pesan error jika terjadi kesalahan saat mengambil data
    }
  };

  // Fungsi untuk mencari baris duplikat berdasarkan kolom 'Message ID - Final'
  const findDuplicates = (data) => {
    const jsonObject = {};
    const duplicates = [];

    data.forEach((row, index) => {
      const key = row["Message ID - Final"]; // Menggunakan kolom 'Message ID - Final' sebagai kunci
      if (jsonObject.hasOwnProperty(key)) {
        duplicates.push({ row, index }); // Jika duplikat ditemukan, masukkan ke dalam array duplicates
      } else {
        jsonObject[key] = row; // Jika tidak duplikat, simpan dalam jsonObject
      }
    });

    if (duplicates.length > 0) {
      alert(`Terdapat ${duplicates.length} baris yang duplikat!`); // Menampilkan jumlah baris duplikat
      setDuplicateRows(duplicates); // Simpan duplikat ke dalam state duplicateRows
    } else {
      alert("Tidak ada duplikat ditemukan."); // Memberikan notifikasi jika tidak ada duplikat
    }
  };

  // Fungsi untuk menangani perubahan pemilihan kolom
  const handleColumnChange = (e) => {
    const value = e.target.value; // Mendapatkan nilai kolom yang dipilih
    setSelectedColumns((prevColumns) =>
      prevColumns.includes(value)
        ? prevColumns.filter((columnName) => columnName !== value) // Jika kolom sudah dipilih, hapus dari state selectedColumns
        : [...prevColumns, value] // Jika kolom belum dipilih, tambahkan ke state selectedColumns
    );
  };

  // Fungsi untuk mengunduh file berdasarkan kolom yang dipilih
  const downloadFiles = () => {
    if (filteredData.length === 0 || selectedColumns.length === 0) {
      alert("Data belum tersedia atau kolom belum dipilih!"); // Peringatan jika data belum ada atau kolom belum dipilih
      return;
    }
    downloadJsonOrZip(selectedColumns, filteredData); // Panggil fungsi untuk mengunduh file dalam format JSON atau ZIP
  };

  return (
    <div>
      <Input
        placeholder="Place Google Spreadsheet link here"
        value={spreadsheetUrl} // Menggunakan state spreadsheetUrl sebagai nilai input
        onChange={handleInputChange} // Fungsi yang dipanggil saat ada perubahan input
      />
      <Button primary onClick={handleDownload}>Fetch Columns</Button>

      {columns.length > 0 && ( // Jika kolom sudah tersedia
        <>
          <ColumnSelector
            columns={columns} // Mengirimkan daftar kolom sebagai props ke ColumnSelector
            selectedColumns={selectedColumns} // Mengirimkan kolom yang dipilih
            handleColumnChange={handleColumnChange} // Fungsi untuk menangani perubahan pilihan kolom
          />
          <Button onClick={downloadFiles}>Download as JSON/ZIP</Button>
        </>
      )}

      {duplicateRows.length > 0 && ( // Jika ada duplikat, tampilkan tabel duplikat
        <DuplicateTable duplicateRows={duplicateRows} columns={columns} /> // Mengirimkan baris duplikat dan kolom ke DuplicateTable
      )}
    </div>
  );
};

export default SpreadsheetDownloader;
