import JSZip from "jszip";
import { saveAs } from "file-saver";

export const downloadJsonOrZip = async (selectedColumns, filteredData) => {
  if (selectedColumns.length === 1) {
    const jsonObject = {};
    filteredData.forEach((row) => {
      const key = row["Message ID - Final"];
      const value = row[selectedColumns[0]];
      if (key && value) {
        jsonObject[key] = value;
      }
    });

    const formattedJson = JSON.stringify(jsonObject, null, 2);
    const blob = new Blob([formattedJson], { type: "application/json" });
    saveAs(blob, `${selectedColumns[0]}.json`);
  } else {
    const zip = new JSZip();
    selectedColumns.forEach((columnName) => {
      const jsonObject = {};
      filteredData.forEach((row) => {
        const key = row["Message ID - Final"];
        const value = row[columnName];
        if (key && value) {
          jsonObject[key] = value;
        }
      });
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      zip.file(`${columnName}.json`, formattedJson);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "columns.zip");
  }
};
