import { useState, useEffect } from 'react';
import TabBar from '../components/backend/TabBar';
import DataTable from '../components/backend/DataTable';
import EventViewer from '../components/backend/EventViewer';
import DetailModal from '../components/DetailModal';
import StatusBadge from '../components/StatusBadge';
import MilestoneCamerasTable from '../components/backend/MilestoneCamerasTable';
import BookmarksTable from '../components/backend/BookmarksTable';
import VMSEventsTable from '../components/backend/VMSEventsTable';
import RecordingServersTable from '../components/backend/RecordingServersTable';
import { initializeData } from '../utils/initData';
import './Backend.css';

export default function Backend() {
  const [activeTab, setActiveTab] = useState('cardholders');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize data on component mount
    const loadData = async () => {
      const loadedData = initializeData();
      setData(loadedData);
      setLoading(false);
    };
    
    loadData();
    
    // Listen for localStorage changes (from workflows or other tabs)
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('pacs-')) {
        console.log('Detected localStorage change, refreshing data...');
        loadData();
      }
    };
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      console.log('Window focused, refreshing data...');
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="backend-loading">
        <p>Loading PACS data...</p>
      </div>
    );
  }

  const tabCounts = {
    'cardholders': data.cardholders.length,
    'access-groups': data.accessGroups.length,
    'doors': data.doors.length,
    'controllers': data.controllers.length,
    'operator-groups': data.operatorGroups.length,
    'inputs': data.inputs.length,
    'outputs': data.outputs.length,
    'events': data.events.length,
    'milestone-cameras': 20,
    'bookmarks': 15,
    'vms-events': 6,
    'recording-servers': 2
  };

  const handleRowClick = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  // Cardholders Table
  const cardholdersColumns = [
    { key: 'id', label: 'ID' },
    {
      key: 'first_name',
      label: 'Name',
      render: (value, row) => `${row.first_name} ${row.last_name}`
    },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'job_title', label: 'Job Title' },
    { key: 'card_number', label: 'Card Number' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <StatusBadge
          status={value?.toLowerCase() === 'active' ? 'success' : 'error'}
          text={value}
          showIcon={false}
        />
      )
    },
    {
      key: 'access_groups',
      label: 'Access Groups',
      render: (value) => value.length
    }
  ];

  // Access Groups Table
  const accessGroupsColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'member_count', label: 'Members' },
    {
      key: 'doors',
      label: 'Doors',
      render: (value) => value.length
    },
    { key: 'schedule', label: 'Schedule' }
  ];

  // Doors Table
  const doorsColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <StatusBadge
          status={value === 'online' ? 'success' : value === 'offline' ? 'error' : 'warning'}
          text={value}
          showIcon={true}
        />
      )
    },
    { key: 'controller_id', label: 'Controller' },
    {
      key: 'last_event',
      label: 'Last Event',
      render: (value) => new Date(value).toLocaleString()
    },
    { key: 'event_count_24h', label: '24h Events' }
  ];

  // Controllers Table
  const controllersColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' },
    { key: 'ip_address', label: 'IP Address' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <StatusBadge
          status={value === 'online' ? 'success' : 'error'}
          text={value}
          showIcon={true}
        />
      )
    },
    { key: 'firmware_version', label: 'Firmware' },
    {
      key: 'last_communication',
      label: 'Last Comm',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  // Inputs Table
  const inputsColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'door_id', label: 'Door' },
    {
      key: 'state',
      label: 'State',
      render: (value) => (
        <StatusBadge
          status={value === 'normal' ? 'success' : value === 'alarm' ? 'error' : 'warning'}
          text={value}
          showIcon={false}
        />
      )
    }
  ];

  // Outputs Table
  const outputsColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'door_id', label: 'Door' },
    {
      key: 'state',
      label: 'State',
      render: (value) => (
        <StatusBadge
          status={value === 'active' ? 'success' : 'info'}
          text={value}
          showIcon={false}
        />
      )
    }
  ];

  // Operator Groups Table
  const operatorGroupsColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'members',
      label: 'Members',
      render: (value) => (
        <span className="badge">{value.length}</span>
      )
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (value) => (
        <span className="badge">{value.length}</span>
      )
    },
    {
      key: 'modified',
      label: 'Last Modified',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="backend">
      <div className="backend-header">
        <div>
          <h1>PACS Backend Browser</h1>
          <p>Explore Gallagher PACS and Milestone XProtect data</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            const loadedData = initializeData();
            setData(loadedData);
          }}
          style={{ marginLeft: 'auto' }}
        >
          Refresh Data
        </button>
      </div>

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={tabCounts}
      />

      <div className="backend-content">
        {activeTab === 'cardholders' && (
          <DataTable
            columns={cardholdersColumns}
            data={data.cardholders}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'cardholders')}
          />
        )}

        {activeTab === 'access-groups' && (
          <DataTable
            columns={accessGroupsColumns}
            data={data.accessGroups}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'access-groups')}
          />
        )}

        {activeTab === 'doors' && (
          <DataTable
            columns={doorsColumns}
            data={data.doors}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'doors')}
          />
        )}

        {activeTab === 'controllers' && (
          <DataTable
            columns={controllersColumns}
            data={data.controllers}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'controllers')}
          />
        )}

        {activeTab === 'operator-groups' && (
          <DataTable
            columns={operatorGroupsColumns}
            data={data.operatorGroups}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'operator-groups')}
          />
        )}

        {activeTab === 'inputs' && (
          <DataTable
            columns={inputsColumns}
            data={data.inputs}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'inputs')}
          />
        )}

        {activeTab === 'outputs' && (
          <DataTable
            columns={outputsColumns}
            data={data.outputs}
            searchable={true}
            pageSize={25}
            onRowClick={(row) => handleRowClick(row, 'outputs')}
          />
        )}

        {activeTab === 'events' && (
          <EventViewer
            events={data.events}
          />
        )}

        {activeTab === 'milestone-cameras' && (
          <MilestoneCamerasTable onRowClick={(row) => handleRowClick(row, 'milestone-camera')} />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksTable onRowClick={(row) => handleRowClick(row, 'bookmark')} />
        )}

        {activeTab === 'vms-events' && (
          <VMSEventsTable onRowClick={(row) => handleRowClick(row, 'vms-event')} />
        )}

        {activeTab === 'recording-servers' && (
          <RecordingServersTable onRowClick={(row) => handleRowClick(row, 'recording-server')} />
        )}
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem?.name || selectedItem?.title || 'Details'}
        data={selectedItem}
        type={selectedType || activeTab}
      />
    </div>
  );
}
