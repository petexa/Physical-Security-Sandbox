import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
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

export default function BackendVendor() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cardholders');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vendor = location.pathname.includes('/gallagher') ? 'gallagher' : 'milestone';

  useEffect(() => {
    // Initialize data on component mount
    const loadData = async () => {
      const loadedData = initializeData();
      setData(loadedData);
      setLoading(false);
    };
    
    loadData();

    // Set active tab from query params
    const params = new URLSearchParams(location.search);
    if (params.get('tab')) {
      setActiveTab(params.get('tab'));
    }
  }, [location]);

  if (loading || !data) {
    return (
      <div className="backend-loading">
        <p>Loading {vendor} data...</p>
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
    }
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
        <StatusBadge status={value === 'online' ? 'success' : 'warning'} text={value} />
      )
    },
    { key: 'controller', label: 'Controller' }
  ];

  // Tabs configuration
  let tabs = [];
  let content = null;

  if (vendor === 'gallagher') {
    tabs = [
      { id: 'cardholders', label: 'Cardholders', count: tabCounts.cardholders },
      { id: 'access-groups', label: 'Access Groups', count: tabCounts['access-groups'] },
      { id: 'doors', label: 'Doors', count: tabCounts.doors },
      { id: 'controllers', label: 'Controllers', count: tabCounts.controllers },
      { id: 'operator-groups', label: 'Operator Groups', count: tabCounts['operator-groups'] },
      { id: 'inputs', label: 'Inputs', count: tabCounts.inputs },
      { id: 'outputs', label: 'Outputs', count: tabCounts.outputs },
      { id: 'events', label: 'Events', count: tabCounts.events }
    ];

    switch (activeTab) {
      case 'cardholders':
        content = (
          <DataTable
            data={data.cardholders}
            columns={cardholdersColumns}
            onRowClick={(item) => handleRowClick(item, 'cardholder')}
          />
        );
        break;
      case 'access-groups':
        content = (
          <DataTable
            data={data.accessGroups}
            columns={accessGroupsColumns}
            onRowClick={(item) => handleRowClick(item, 'access-group')}
          />
        );
        break;
      case 'doors':
        content = (
          <DataTable
            data={data.doors}
            columns={doorsColumns}
            onRowClick={(item) => handleRowClick(item, 'door')}
          />
        );
        break;
      case 'operator-groups':
        content = (
          <DataTable
            data={data.operatorGroups || []}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'description', label: 'Description' }
            ]}
            onRowClick={(item) => handleRowClick(item, 'operator-group')}
          />
        );
        break;
      case 'inputs':
        content = (
          <DataTable
            data={data.inputs || []}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'type', label: 'Type' }
            ]}
            onRowClick={(item) => handleRowClick(item, 'input')}
          />
        );
        break;
      case 'outputs':
        content = (
          <DataTable
            data={data.outputs || []}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'type', label: 'Type' }
            ]}
            onRowClick={(item) => handleRowClick(item, 'output')}
          />
        );
        break;
      case 'controllers':
        content = (
          <DataTable
            data={data.controllers || []}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'ip_address', label: 'IP Address' }
            ]}
            onRowClick={(item) => handleRowClick(item, 'controller')}
          />
        );
        break;
      case 'events':
        content = <EventViewer events={data.events} />;
        break;
      default:
        content = null;
    }
  } else if (vendor === 'milestone') {
    tabs = [
      { id: 'cameras', label: 'Cameras', count: tabCounts['milestone-cameras'] },
      { id: 'recording-servers', label: 'Recording Servers', count: tabCounts['recording-servers'] },
      { id: 'bookmarks', label: 'Bookmarks', count: tabCounts.bookmarks },
      { id: 'vms-events', label: 'Events', count: tabCounts['vms-events'] }
    ];

    switch (activeTab) {
      case 'cameras':
        content = <MilestoneCamerasTable onCameraClick={(item) => handleRowClick(item, 'camera')} />;
        break;
      case 'recording-servers':
        content = <RecordingServersTable onServerClick={(item) => handleRowClick(item, 'server')} />;
        break;
      case 'bookmarks':
        content = <BookmarksTable onBookmarkClick={(item) => handleRowClick(item, 'bookmark')} />;
        break;
      case 'vms-events':
        content = <VMSEventsTable />;
        break;
      default:
        content = null;
    }
  }

  return (
    <div className="backend-page">
      <div className="backend-header">
        <button className="back-button" onClick={() => navigate('/backend')}>
          <ChevronLeft size={20} />
          Back to Dashboard
        </button>
        <h1>{vendor.charAt(0).toUpperCase() + vendor.slice(1)} Systems</h1>
      </div>

      <TabBar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          navigate(`/backend/${vendor}?tab=${tabId}`);
        }}
      />

      {content}

      {isModalOpen && selectedItem && (
        <DetailModal
          item={selectedItem}
          type={selectedType}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
