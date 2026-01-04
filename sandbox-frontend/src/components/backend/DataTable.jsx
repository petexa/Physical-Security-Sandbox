import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
  columns,
  data,
  onRowClick,
  pageSize: initialPageSize = 25,
  searchable = true,
  selectable = false
}) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Filter data by search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const search = searchTerm.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(search);
      });
    });
  }, [data, searchTerm, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue < bValue ? -1 : 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleSelectRow = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <div className="empty-state-icon">📭</div>
        <h3 className="empty-state-title">No items found</h3>
        <p className="empty-state-description">
          {searchable ? 'Try adjusting your search or filters' : 'Select an item from the list to view details'}
        </p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="data-table-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <span className="search-results">
              {sortedData.length} result{sortedData.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {selectable && (
                <th className="select-column">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable !== false ? 'sortable' : ''}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="th-content">
                    <span>{column.label}</span>
                    {column.sortable !== false && sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className={onRowClick ? 'clickable' : ''}
                onClick={() => handleRowClick(row)}
              >
                {selectable && (
                  <td className="select-column">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(row.id);
                      }}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-table-footer">
        <div className="page-size-selector">
          <label>Show</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>

        <div className="pagination-info">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
        </div>

        <div className="pagination-controls">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
