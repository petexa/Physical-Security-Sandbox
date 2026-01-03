import { useState, useMemo } from 'react';
import TabBar from '../components/backend/TabBar';
import DataTable from '../components/backend/DataTable';
import EventViewer from '../components/backend/EventViewer';
import StatusBadge from '../components/StatusBadge';
import { initializeData } from '../utils/initData';
import './Backend.css';

export default function Backend() {
  const [activeTab, setActiveTab] = useState('cardholders');
  const [loading, setLoading] = useState(true);

  // Use useMemo to initialize data once
  const data = useMemo(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 0);
      return initializeData();
    }
    return null;
  }, [loading]);

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
    'inputs': data.inputs.length,
    'outputs': data.outputs.length,
    'events': data.events.length
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
          status={value === 'active' ? 'success' : 'error'}
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

  return (
    <div className="backend">
      <div className="backend-header">
        <h1>PACS Backend Browser</h1>
        <p>Browse and explore simulated physical access control system data</p>
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
          />
        )}

        {activeTab === 'access-groups' && (
          <DataTable
            columns={accessGroupsColumns}
            data={data.accessGroups}
            searchable={true}
            pageSize={25}
          />
        )}

        {activeTab === 'doors' && (
          <DataTable
            columns={doorsColumns}
            data={data.doors}
            searchable={true}
            pageSize={25}
          />
        )}

        {activeTab === 'controllers' && (
          <DataTable
            columns={controllersColumns}
            data={data.controllers}
            searchable={true}
            pageSize={25}
          />
        )}

        {activeTab === 'inputs' && (
          <DataTable
            columns={inputsColumns}
            data={data.inputs}
            searchable={true}
            pageSize={25}
          />
        )}

        {activeTab === 'outputs' && (
          <DataTable
            columns={outputsColumns}
            data={data.outputs}
            searchable={true}
            pageSize={25}
          />
        )}

        {activeTab === 'events' && (
          <EventViewer
            events={data.events}
          />
        )}
      </div>
    </div>
  );
}
