import DataTable from './DataTable';
import bookmarksData from '../../mock-data/milestone/bookmarks.json';

function BookmarksTable({ onRowClick }) {
  const columns = [
    { key: 'name', label: 'Bookmark Name', sortable: true },
    { 
      key: 'created', 
      label: 'Created', 
      sortable: true,
      render: (value, row) => new Date(row.created).toLocaleString()
    },
    {
      key: 'timeBegin',
      label: 'Time Range',
      render: (value, row) => {
        const start = new Date(row.timeBegin).toLocaleTimeString();
        const end = new Date(row.timeEnd).toLocaleTimeString();
        const date = new Date(row.timeBegin).toLocaleDateString();
        return `${date} ${start} - ${end}`;
      }
    },
    { 
      key: 'camera.name', 
      label: 'Camera', 
      render: (value, row) => row.camera.name
    },
    { 
      key: 'createdBy.name', 
      label: 'Created By', 
      render: (value, row) => row.createdBy.name
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value, row) => (
        <div className="tag-list">
          {row.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {row.tags?.length > 3 && <span className="tag-more">+{row.tags.length - 3}</span>}
        </div>
      )
    },
    {
      key: 'relatedPACSEvent',
      label: 'PACS Event',
      render: (value, row) => row.relatedPACSEvent ? '✓ Linked' : '-'
    }
  ];

  return (
    <div className="bookmarks-table">
      <div className="table-header">
        <h2>Video Bookmarks</h2>
        <div className="table-stats">
          <span>Total: {bookmarksData.length}</span>
          <span>PACS Linked: {bookmarksData.filter(b => b.relatedPACSEvent).length}</span>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={bookmarksData}
        onRowClick={onRowClick}
        searchable={true}
        pageSize={25}
      />
    </div>
  );
}

export default BookmarksTable;
