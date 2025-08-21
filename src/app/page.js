// to build the server, need to 'npm run build in terminal then
// to run the server, need to npm run start. to enable hot reload, need to npm run dev
// need to include a launch.json file to start in chrome, or i have to enter http://localhost:3000 in my browser
/* TODO
   read content from json file instead of hard coded
   allow an owned/wishlist/favorites section
   allow adding/removing/hiding rows or column
   option to show favorites only
   display X per page and make pages
*/

'use client'
import React, { useState, useMemo } from "react";

// Static config and data
const TABLE_HEADERS = ['Game', 'Platform', 'Release Date', 'Rating'];
const TABLE_KEYS = ['name', 'platform', 'release date', 'rating'];
const GAMES_DATA = [
  { name: "Doom", platform: "id Software", "release date": "1993", rating: "90" },
  { name: "Mario", platform: "Nintendo", "release date": "1985", rating: "95" },
  { name: "Sonic", platform: "Sega", "release date": "1990", rating: "98" },
  { name: "Vectorman", platform: "Sega", "release date": "1992", rating: "85" },
  { name: "Zelda", platform: "Nintendo", "release date": "1986", rating: "95" },
];

export default function Home() {
  // Memoize headers/keys to avoid recreating arrays
  const headers = useMemo(() => TABLE_HEADERS, []);
  const keys = useMemo(() => TABLE_KEYS, []);
  return (
    <div>
      <Table data={GAMES_DATA} headers={headers} keys={keys} />
    </div>
  );
}

// Helper: sort and filter logic
function getFilteredSortedData(data, keys, filterText, sortConfig) {
  let filtered = data;
  if (filterText) {
    const lower = filterText.toLowerCase();
    filtered = data.filter((item) =>
      keys.some((key) => String(item[key]).toLowerCase().includes(lower))
    );
  }
  if (sortConfig.key) {
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }
  return filtered;
}

function Table({ data, headers, keys }) {
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const filteredSortedData = useMemo(
    () => getFilteredSortedData(data, keys, filterText, sortConfig),
    [data, keys, filterText, sortConfig]
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  return (
    <table className="table-base">
      <thead>
        <tr className="table-header">
          {headers.map((header, idx) => {
            const key = keys[idx];
            const arrow = sortConfig.key === key ? (sortConfig.direction === "ascending" ? " ▲" : " ▼") : "";
            return (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ cursor: "pointer" }}
              >
                {header}
                {arrow}
              </th>
            );
          })}
        </tr>
        <tr className="filter-row">
          <td colSpan={headers.length}>
            <FilterBox filterText={filterText} setFilterText={setFilterText} />
          </td>
        </tr>
      </thead>
      <tbody>
        {filteredSortedData.map((row, idx) => (
          <tr key={idx}>
            {keys.map((key) => (
              <td key={key}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FilterBox({ filterText, setFilterText }) {
  return (
    <input
      type="text"
      placeholder="Filter table..."
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
    />
  );
}
