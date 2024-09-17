import JSZip from "jszip";
import { saveAs } from "file-saver";

// Fungsi untuk mengunduh file sebagai JSON atau ZIP dengan sorting berdasarkan kunci
export const downloadJsonOrZip = async (selectedColumns, filteredData) => {
  // Fungsi untuk sorting kunci objek JSON berdasarkan abjad
  const sortKeysAlphabetically = (obj) => {
    return Object.keys(obj)
      .sort() // Urutkan kunci secara abjad
      .reduce((sortedObj, key) => {
        sortedObj[key] = obj[key]; // Bentuk objek baru yang sudah diurutkan
        return sortedObj;
      }, {});
  };


  // fungsi untuk cek apakah terdapat key yang kosong atau tidak
  const checkForEmptyKeys = (data) => {
    let hasEmptyKey = false;
    data.forEach((row) => {
      const key = row["Message ID - Final"]; // key yang ingin di periksa
      selectedColumns.forEach((columnName) => {
        if (!key && row[columnName]) { // jika ada key kosong
          alert("Message ID is required!"); // tampilkan pesan peringatan
          hasEmptyKey = true;
        }
      });
    });
    return hasEmptyKey; // mengembalikan true kalau ada key kosong
  };

  const hasEmptyKey = checkForEmptyKeys(filteredData);
  if (hasEmptyKey) return; // jika ada key kosong, hentikan proses download

  // Jika hanya satu kolom yang dipilih
  if (selectedColumns.length === 1) {
    const jsonObject = {};
    filteredData.forEach((row) => {
      const key = row["Message ID - Final"]; // menggunakan 'Message ID - Final' sebagai kunci
      const value = row[selectedColumns[0]]; // nilai diambil dari kolom yang dipilih
      if (key && value) {
        jsonObject[key] = value; // menambah key dan value ke objek JSON
      }
    });

    // Sort data key berdasarkan alphabet sebelum diunduh
    const sortedJson = sortKeysAlphabetically(jsonObject);

    // Format JSON menjadi string yang rapi
    const formattedJson = JSON.stringify(sortedJson, null, 2);
    const blob = new Blob([formattedJson], { type: "application/json" });
    saveAs(blob, `${selectedColumns[0]}.json`); // Unduh file .json dengan nama kolom
  } else {
    // jika lebih dari satu kolom terpilih, buat menjadi file ZIP
    const zip = new JSZip();
    selectedColumns.forEach((columnName) => {
      const jsonObject = {};
      filteredData.forEach((row) => {
        const key = row["Message ID - Final"];
        const value = row[columnName]; // value diambil dari setiap kolom yang dipilih
        if (key && value) {
          jsonObject[key] = value;
        }
      });

      // Sort data berdasarkan kunci sebelum ditambahkan ke file ZIP
      const sortedJson = sortKeysAlphabetically(jsonObject);
      const formattedJson = JSON.stringify(sortedJson, null, 2);
      zip.file(`${columnName}.json`, formattedJson); // nama file sesuai dengan nama kolom
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "columns.zip"); // Unduh file ZIP
  }
};
