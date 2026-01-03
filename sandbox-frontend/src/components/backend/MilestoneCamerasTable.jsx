import DataTable from './DataTable';
import StatusBadge from '../StatusBadge';
import camerasData from '../../mock-data/milestone/cameras.json';

function MilestoneCamerasTable({ onRowClick }) {
  const columns = [
    { key: 'name', label: 'Camera Name', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { 
      key: 'state', 
      label: 'Status', 
      render: (value, row) => (
        <StatusBadge 
          status={row.state === 'Recording' ? 'success' : 'error'}
          text={row.state}
        />
      )
    },
    { 
      key: 'recording.enabled', 
      label: 'Recording', 
      render: (value, row) => row.recording.enabled ? '✓ Yes' : '✗ No'
    },
    {
      key: 'linkedDoors',
      label: 'Linked Doors',
      render: (value, row) => `${row.linkedDoors?.length || 0}${row.linkedDoors?.length > 0 ? ' 🔗' : ''}`
    },
    {
      key: 'hardware.model',
      label: 'Model',
      render: (value, row) => row.hardware.model
    }
  ];

  return (
    <div className="milestone-cameras-table">
      <div className="table-header">
        <h2>Milestone XProtect Cameras</h2>
        <div className="table-stats">
          <span>Total: {camerasData.length}</span>
          <span>Recording: {camerasData.filter(c => c.state === 'Recording').length}</span>
          <span>PACS Linked: {camerasData.filter(c => c.linkedDoors?.length > 0).length}</span>
        </div>
      </div>
      <DataTable 
        columns={columns}
        data={camerasData}
        onRowClick={onRowClick}
        searchable={true}
        pageSize={25}
      />
    </div>
  );
}

export default MilestoneCamerasTable;
