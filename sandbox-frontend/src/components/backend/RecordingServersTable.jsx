import DataTable from './DataTable';
import StatusBadge from '../StatusBadge';
import serversData from '../../mock-data/milestone/recording-servers.json';

function RecordingServersTable({ onRowClick }) {
  const columns = [
    { key: 'name', label: 'Server Name', sortable: true },
    { key: 'address', label: 'IP Address', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => (
        <StatusBadge 
          status={row.status === 'Online' ? 'success' : 'error'}
          text={row.status}
        />
      )
    },
    { key: 'version', label: 'Version' },
    {
      key: 'cameras',
      label: 'Cameras',
      render: (value, row) => row.cameras.length
    },
    {
      key: 'storage.percentUsed',
      label: 'Storage',
      render: (value, row) => `${row.storage.percentUsed}% (${row.storage.used} / ${row.storage.total})`
    }
  ];

  return (
    <div className="recording-servers-table">
      <div className="table-header">
        <h2>Recording Servers</h2>
        <div className="table-stats">
          <span>Total: {serversData.length}</span>
          <span>Online: {serversData.filter(s => s.status === 'Online').length}</span>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={serversData}
        onRowClick={onRowClick}
        searchable={true}
        pageSize={25}
      />
    </div>
  );
}

export default RecordingServersTable;
