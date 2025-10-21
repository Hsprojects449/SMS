import Papa from "papaparse";

export const exportCSV = (
  data,
  filterModel,
  sortModel,
  filename,
  showMessage,
  mapRow
) => {
  if (!data || !data.length) {
    showMessage("No data available for export", "error");
    return;
  }

  let exportData = [...data];

  // ✅ Apply filters
  if (filterModel?.items?.length) {
    exportData = exportData.filter((row) =>
      filterModel.items.every((filter) => {
        if (!filter.value) return true;
        const fieldValue = row[filter.field]?.toString().toLowerCase() || "";
        return fieldValue.includes(filter.value.toLowerCase());
      })
    );
  }

  // ✅ Apply sorting
  if (sortModel?.length) {
    const { field, sort } = sortModel[0];
    exportData = [...exportData].sort((a, b) => {
      const aValue = a[field]?.toString().toLowerCase() || "";
      const bValue = b[field]?.toString().toLowerCase() || "";
      if (aValue < bValue) return sort === "asc" ? -1 : 1;
      if (aValue > bValue) return sort === "asc" ? 1 : -1;
      return 0;
    });
  }

  if (!exportData.length) {
    showMessage("No matching data available after filtering", "error");
    return;
  }

  // ✅ Transform rows if mapper provided
  const csvData = mapRow ? exportData.map(mapRow) : exportData;

  const csv = Papa.unparse(csvData);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};