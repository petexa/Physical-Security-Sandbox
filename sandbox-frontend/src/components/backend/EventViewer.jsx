import { useState, useMemo, useEffect } from 'react';
import { Download, Filter, X, Calendar, ChevronDown } from 'lucide-react';
import DataTable from './DataTable';
import StatusBadge from '../StatusBadge';
import './EventViewer.css';
import {
  filterEvents,
  exportToCSV,
  exportToJSON,
  getEventStatistics,
  getTopDoorsByActivity,
  getTopCardholdersByActivity,
  getFaultsAndAlarms
} from '../../utils/eventQuery';

export default function EventViewer({ events, doors, cardholders }) {
  const [filters, setFilters] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0],
    eventTypes: [],
    doorIds: [],
    cardholderIds: [],
    searchText: ''
  });
  
  const [showFilters, setShowFilters] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Apply filters
  const filteredEvents = useMemo(() => {
    return filterEvents(events, filters);
  }, [events, filters]);

  // Get statistics
  const statistics = useMemo(() => {
    return getEventStatistics(filteredEvents);
  }, [filteredEvents]);

  const topDoors = useMemo(() => {
    return getTopDoorsByActivity(filteredEvents, 5);
  }, [filteredEvents]);

  const topCardholders = useMemo(() => {
    return getTopCardholdersByActivity(filteredEvents, 5);
  }, [filteredEvents]);

  const faultsAndAlarms = useMemo(() => {
    return getFaultsAndAlarms(filteredEvents);
  }, [filteredEvents]);

  // Quick date filters
  const setQuickDate = (days) => {
    const end = new Date();
    const start = new Date();
    
    if (days === 0) {
      // Today
      setFilters({
        ...filters,
        startDate: end.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      });
    } else if (days === -1) {
      // All time
      setFilters({
        ...filters,
        startDate: '2024-07-01',
        endDate: '2024-12-31'
      });
    } else {
      start.setDate(end.getDate() - days);
      setFilters({
        ...filters,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0]
      });
    }
  };

  // Export functions
  const handleExport = (format) => {
    const filename = `pacs-events-${filters.startDate}-to-${filters.endDate}`;
    
    if (format === 'csv') {
      const csv = exportToCSV(filteredEvents);
      downloadFile(csv, `${filename}.csv`, 'text/csv');
    } else if (format === 'json') {
      const json = exportToJSON(filteredEvents);
      downloadFile(json, `${filename}.json`, 'application/json');
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get event type color
  const getEventTypeColor = (eventType, category) => {
    if (eventType === 'access_granted') return 'success';
    if (eventType === 'access_denied') return 'error';
    if (category === 'alarm') return 'error';
    if (category === 'fault') return 'warning';
    if (category === 'system') return 'info';
    return 'info';
  };

  // Event type options
  const eventTypeOptions = [
    { value: 'access_granted', label: 'Access Granted' },
    { value: 'access_denied', label: 'Access Denied' },
    { value: 'door_forced', label: 'Door Forced' },
    { value: 'door_held', label: 'Door Held' },
    { value: 'tamper_alarm', label: 'Tamper Alarm' },
    { value: 'forced_entry_alarm', label: 'Forced Entry' },
    { value: 'sensor_fault', label: 'Sensor Fault' },
    { value: 'reader_offline', label: 'Reader Offline' },
    { value: 'controller_offline', label: 'Controller Offline' }
  ];

  // Table columns
  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (value) => new Date(value).toLocaleString()
    },
    {
      key: 'event_type',
      label: 'Event Type',
      render: (value, row) => (
        <StatusBadge
          status={getEventTypeColor(value, row.category)}
          text={value.replace(/_/g, ' ')}
          showIcon={false}
        />
      )
    },
    {
      key: 'door_name',
      label: 'Door'
    },
    {
      key: 'cardholder_name',
      label: 'Cardholder',
      render: (value) => value || '-'
    },
    {
      key: 'details',
      label: 'Details',
      render: (value) => (
        <span className="event-details">{value}</span>
      )
    }
  ];

  const activeFilterCount = [
    filters.eventTypes.length > 0,
    filters.doorIds.length > 0,
    filters.cardholderIds.length > 0,
    filters.searchText.length > 0
  ].filter(Boolean).length;

  return (
    <div className="event-viewer">
      {/* Statistics Dashboard */}
      <div className="event-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{filteredEvents.length.toLocaleString()}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-value">{(statistics.byType?.access_granted || 0).toLocaleString()}</div>
          <div className="stat-label">Access Granted</div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-value">{faultsAndAlarms.filter(e => e.category === 'fault').length}</div>
          <div className="stat-label">Faults</div>
        </div>
        <div className="stat-card stat-error">
          <div className="stat-value">{faultsAndAlarms.filter(e => e.event_type === 'access_denied').length}</div>
          <div className="stat-label">Denials</div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="filter-panel">
        <div className="filter-header">
          <button
            className="btn btn-ghost"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
            <ChevronDown size={16} className={showFilters ? 'rotate-180' : ''} />
          </button>

          <div className="filter-actions">
            <div className="export-dropdown">
              <button className="btn btn-primary">
                <Download size={18} />
                Export
              </button>
              <div className="export-menu">
                <button onClick={() => handleExport('csv')}>Export as CSV</button>
                <button onClick={() => handleExport('json')}>Export as JSON</button>
              </div>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="filter-content">
            {/* Quick Date Filters */}
            <div className="filter-group">
              <label>Quick Filters</label>
              <div className="quick-filters">
                <button className="btn btn-ghost btn-sm" onClick={() => setQuickDate(0)}>Today</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setQuickDate(7)}>Last 7 Days</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setQuickDate(30)}>Last 30 Days</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setQuickDate(-1)}>All</button>
              </div>
            </div>

            {/* Date Range */}
            <div className="filter-row">
              <div className="filter-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  min="2024-07-01"
                  max="2024-12-31"
                />
              </div>
              <div className="filter-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  min="2024-07-01"
                  max="2024-12-31"
                />
              </div>
            </div>

            {/* Event Types */}
            <div className="filter-group">
              <label>Event Types</label>
              <div className="checkbox-group">
                {eventTypeOptions.map((option) => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.eventTypes.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({
                            ...filters,
                            eventTypes: [...filters.eventTypes, option.value]
                          });
                        } else {
                          setFilters({
                            ...filters,
                            eventTypes: filters.eventTypes.filter(t => t !== option.value)
                          });
                        }
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <button
                className="btn btn-ghost"
                onClick={() => setFilters({
                  ...filters,
                  eventTypes: [],
                  doorIds: [],
                  cardholderIds: [],
                  searchText: ''
                })}
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Top Activity Lists */}
      <div className="activity-grid">
        <div className="activity-card">
          <h4>Top Doors by Activity</h4>
          <div className="activity-list">
            {topDoors.map((item, index) => (
              <div key={index} className="activity-item">
                <span className="activity-name">{item.door_name}</span>
                <span className="activity-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="activity-card">
          <h4>Top Cardholders by Activity</h4>
          <div className="activity-list">
            {topCardholders.map((item, index) => (
              <div key={index} className="activity-item">
                <span className="activity-name">{item.cardholder_name}</span>
                <span className="activity-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="events-table">
        <DataTable
          columns={columns}
          data={filteredEvents}
          onRowClick={setSelectedEvent}
          pageSize={50}
          searchable={true}
        />
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="event-modal" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h3>Event Details</h3>
              <button className="btn btn-ghost" onClick={() => setSelectedEvent(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="event-modal-body">
              <div className="event-detail-row">
                <strong>ID:</strong>
                <span>{selectedEvent.id}</span>
              </div>
              <div className="event-detail-row">
                <strong>Timestamp:</strong>
                <span>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
              </div>
              <div className="event-detail-row">
                <strong>Event Type:</strong>
                <StatusBadge
                  status={getEventTypeColor(selectedEvent.event_type, selectedEvent.category)}
                  text={selectedEvent.event_type.replace(/_/g, ' ')}
                />
              </div>
              <div className="event-detail-row">
                <strong>Category:</strong>
                <span>{selectedEvent.category}</span>
              </div>
              <div className="event-detail-row">
                <strong>Door:</strong>
                <span>{selectedEvent.door_name} ({selectedEvent.door_id})</span>
              </div>
              <div className="event-detail-row">
                <strong>Location:</strong>
                <span>{selectedEvent.location}</span>
              </div>
              {selectedEvent.cardholder_name && (
                <>
                  <div className="event-detail-row">
                    <strong>Cardholder:</strong>
                    <span>{selectedEvent.cardholder_name} ({selectedEvent.cardholder_id})</span>
                  </div>
                  <div className="event-detail-row">
                    <strong>Card Number:</strong>
                    <span>{selectedEvent.card_number}</span>
                  </div>
                  <div className="event-detail-row">
                    <strong>Access Group:</strong>
                    <span>{selectedEvent.access_group}</span>
                  </div>
                </>
              )}
              <div className="event-detail-row">
                <strong>Details:</strong>
                <span>{selectedEvent.details}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
