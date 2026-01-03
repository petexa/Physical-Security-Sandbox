import DataTable from './DataTable';
import StatusBadge from '../StatusBadge';
import vmsEventsData from '../../mock-data/milestone/events.json';

function VMSEventsTable({ onRowClick }) {
  const columns = [
    { 
      key: 'timestamp', 
      label: 'Timestamp', 
      sortable: true,
      render: (value, row) => new Date(row.timestamp).toLocaleString()
    },
    { key: 'type', label: 'Event Type', sortable: true },
    {
      key: 'source.name',
      label: 'Source',
      render: (value, row) => row.source.name
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value, row) => {
        const statusMap = {
          'High': 'error',
          'Medium': 'warning',
          'Low': 'info'
        };
        return <StatusBadge status={statusMap[row.priority]} text={row.priority} />;
      }
    },
    { key: 'message', label: 'Message' },
    {
      key: 'acknowledged',
      label: 'Status',
      render: (value, row) => row.acknowledged ? '✓ Acknowledged' : '⚠ Pending'
    }
  ];

  return (
    <div className="vms-events-table">
      <div className="table-header">
        <h2>VMS System Events</h2>
        <div className="table-stats">
          <span>Total: {vmsEventsData.length}</span>
          <span>Pending: {vmsEventsData.filter(e => !e.acknowledged).length}</span>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={vmsEventsData}
        onRowClick={onRowClick}
        searchable={true}
        pageSize={25}
      />
    </div>
  );
}

export default VMSEventsTable;
