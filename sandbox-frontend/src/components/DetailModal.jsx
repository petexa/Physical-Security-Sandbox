import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './DetailModal.css';

function CardholderDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.first_name} {data.last_name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Email</div>
            <div className="detail-value">{data.email}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Phone</div>
            <div className="detail-value">{data.phone || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Organization</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Department</div>
            <div className="detail-value">{data.department}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Job Title</div>
            <div className="detail-value">{data.job_title}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Division</div>
            <div className="detail-value">{data.division || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Credentials</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Card Number</div>
            <div className="detail-value"><code>{data.card_number}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Card Type</div>
            <div className="detail-value">{data.card_type || 'Standard'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Access Groups</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Assigned Groups</div>
            <div className="detail-value">
              {data.access_groups && data.access_groups.length > 0 ? (
                <ul className="detail-list">
                  {data.access_groups.map((group, idx) => (
                    <li key={idx}>{group}</li>
                  ))}
                </ul>
              ) : 'None'}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.status === 'active' ? 'success' : 'error'} 
                text={data.status}
                showIcon={false}
              />
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Authorized</div>
            <div className="detail-value">{data.authorized !== false ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoorDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Location</div>
            <div className="detail-value">{data.location}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.description || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Hardware</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Controller</div>
            <div className="detail-value"><code>{data.controller_id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Reader ID</div>
            <div className="detail-value"><code>{data.reader_id || 'N/A'}</code></div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.status === 'online' ? 'success' : data.status === 'offline' ? 'error' : 'warning'}
                text={data.status}
                showIcon={true}
              />
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Mode</div>
            <div className="detail-value">{data.mode || 'Normal'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Activity</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Last Event</div>
            <div className="detail-value">{data.last_event ? new Date(data.last_event).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">24h Events</div>
            <div className="detail-value">{data.event_count_24h || 0}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControllerDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Location</div>
            <div className="detail-value">{data.location}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Network</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">IP Address</div>
            <div className="detail-value"><code>{data.ip_address}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Serial Number</div>
            <div className="detail-value"><code>{data.serial_number}</code></div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Hardware</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Model</div>
            <div className="detail-value">{data.model || 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Firmware</div>
            <div className="detail-value">{data.firmware_version}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Boot Version</div>
            <div className="detail-value">{data.boot_version || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.status === 'online' ? 'success' : 'error'}
                text={data.status}
                showIcon={true}
              />
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Last Communication</div>
            <div className="detail-value">{data.last_communication ? new Date(data.last_communication).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Type</div>
            <div className="detail-value">{data.type}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Location</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.location}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Door</div>
            <div className="detail-value"><code>{data.door_id || 'N/A'}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Controller</div>
            <div className="detail-value"><code>{data.controller_id || 'N/A'}</code></div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Configuration</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Normal State</div>
            <div className="detail-value">{data.normal_state || 'Closed'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Current State</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">State</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.state === 'normal' ? 'success' : data.state === 'alarm' ? 'error' : 'warning'}
                text={data.state}
                showIcon={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutputDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Type</div>
            <div className="detail-value">{data.type}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Location</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.location}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Door</div>
            <div className="detail-value"><code>{data.door_id || 'N/A'}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Controller</div>
            <div className="detail-value"><code>{data.controller_id || 'N/A'}</code></div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Configuration</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Pulse Duration</div>
            <div className="detail-value">{data.pulse_duration || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Current State</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">State</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.state === 'active' ? 'success' : 'info'}
                text={data.state}
                showIcon={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OperatorGroupDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.description}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Members</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Group Members</div>
            <div className="detail-value">
              {data.members && data.members.length > 0 ? (
                <ul className="detail-list">
                  {data.members.map((member) => (
                    <li key={member.id}>
                      <strong>{member.name}</strong> - {member.email}
                    </li>
                  ))}
                </ul>
              ) : 'No members'}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Roles</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Assigned Roles</div>
            <div className="detail-value">
              {data.roles && data.roles.length > 0 ? (
                <ul className="detail-list">
                  {data.roles.map((role, idx) => (
                    <li key={idx}>{role}</li>
                  ))}
                </ul>
              ) : 'No roles'}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessGroupDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.description}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Access Configuration</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Member Count</div>
            <div className="detail-value">{data.member_count || 0}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Schedule</div>
            <div className="detail-value">{data.schedule || 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Doors</div>
            <div className="detail-value">
              {data.doors && data.doors.length > 0 ? (
                <ul className="detail-list">
                  {data.doors.map((door, idx) => (
                    <li key={idx}>{door}</li>
                  ))}
                </ul>
              ) : 'No doors assigned'}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CameraDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Location</div>
            <div className="detail-value">{data.location}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Network</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">IP Address</div>
            <div className="detail-value"><code>{data.ip_address}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Stream URL</div>
            <div className="detail-value" style={{wordBreak: 'break-all'}}>
              <code>{data.stream_url || 'N/A'}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.status === 'online' ? 'success' : 'error'}
                text={data.status}
                showIcon={true}
              />
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Recording</div>
            <div className="detail-value">{data.recording ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Metadata</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{data.created ? new Date(data.created).toLocaleString() : 'N/A'}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Modified</div>
            <div className="detail-value">{data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MilestoneCameraDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">ID</div>
            <div className="detail-value"><code>{data.id}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Location</div>
            <div className="detail-value">{data.location}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">State</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.state === 'Recording' ? 'success' : 'error'} 
                text={data.state} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Hardware</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Manufacturer</div>
            <div className="detail-value">{data.hardware.manufacturer}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Model</div>
            <div className="detail-value">{data.hardware.model}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">IP Address</div>
            <div className="detail-value"><code>{data.hardware.address}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Firmware</div>
            <div className="detail-value">{data.hardware.firmwareVersion}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Linked PACS Doors</h3>
        <div className="detail-rows">
          {data.linkedDoors?.length > 0 ? (
            data.linkedDoors.map(doorId => (
              <div key={doorId} className="detail-row">
                <div className="detail-label">Door</div>
                <div className="detail-value"><code>{doorId}</code></div>
              </div>
            ))
          ) : (
            <p>No linked doors</p>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Recording</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Mode</div>
            <div className="detail-value">{data.recording.mode}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Retention</div>
            <div className="detail-value">{data.recording.retention} days</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Storage Used</div>
            <div className="detail-value">{data.recording.storageUsed}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookmarkDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Bookmark Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Description</div>
            <div className="detail-value">{data.description}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Time Range</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Start</div>
            <div className="detail-value">{new Date(data.timeBegin).toLocaleString()}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">End</div>
            <div className="detail-value">{new Date(data.timeEnd).toLocaleString()}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Duration</div>
            <div className="detail-value">{Math.round((new Date(data.timeEnd) - new Date(data.timeBegin)) / 60000)} min</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Camera</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Camera</div>
            <div className="detail-value">{data.camera.name}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Created By</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Operator</div>
            <div className="detail-value">{data.createdBy.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Created</div>
            <div className="detail-value">{new Date(data.created).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {data.relatedPACSEvent && (
        <div className="detail-section">
          <h3>Related PACS Event</h3>
          <div className="detail-rows">
            <div className="detail-row">
              <div className="detail-label">Event ID</div>
              <div className="detail-value"><code>{data.relatedPACSEvent}</code></div>
            </div>
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3>Tags</h3>
        <div className="tag-list">
          {data.tags?.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VMSEventDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Event Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Type</div>
            <div className="detail-value">{data.type}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Timestamp</div>
            <div className="detail-value">{new Date(data.timestamp).toLocaleString()}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Priority</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.priority === 'High' ? 'error' : data.priority === 'Medium' ? 'warning' : 'info'} 
                text={data.priority} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Source</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.source.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Type</div>
            <div className="detail-value">{data.source.type}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Message</h3>
        <p>{data.message}</p>
      </div>

      <div className="detail-section">
        <h3>Acknowledgement</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">{data.acknowledged ? 'Acknowledged' : 'Pending'}</div>
          </div>
          {data.acknowledged && (
            <>
              <div className="detail-row">
                <div className="detail-label">By</div>
                <div className="detail-value">{data.acknowledgedBy}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">At</div>
                <div className="detail-value">{new Date(data.acknowledgedAt).toLocaleString()}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordingServerDetails({ data }) {
  return (
    <div className="detail-grid">
      <div className="detail-section">
        <h3>Server Information</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Name</div>
            <div className="detail-value">{data.name}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">IP Address</div>
            <div className="detail-value"><code>{data.address}</code></div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value">
              <StatusBadge 
                status={data.status === 'Online' ? 'success' : 'error'} 
                text={data.status} 
              />
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Version</div>
            <div className="detail-value">{data.version}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Cameras</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Count</div>
            <div className="detail-value">{data.cameras.length}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Storage</h3>
        <div className="detail-rows">
          <div className="detail-row">
            <div className="detail-label">Total</div>
            <div className="detail-value">{data.storage.total}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Used</div>
            <div className="detail-value">{data.storage.used}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Available</div>
            <div className="detail-value">{data.storage.available}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Percent Used</div>
            <div className="detail-value">{data.storage.percentUsed}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailModal({ isOpen, onClose, title, data, type }) {
  if (!isOpen || !data) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderDetails = () => {
    switch (type) {
      case 'cardholders':
        return <CardholderDetails data={data} />;
      case 'doors':
        return <DoorDetails data={data} />;
      case 'controllers':
        return <ControllerDetails data={data} />;
      case 'inputs':
        return <InputDetails data={data} />;
      case 'outputs':
        return <OutputDetails data={data} />;
      case 'operator-groups':
        return <OperatorGroupDetails data={data} />;
      case 'access-groups':
        return <AccessGroupDetails data={data} />;
      case 'cameras':
        return <CameraDetails data={data} />;
      case 'milestone-camera':
        return <MilestoneCameraDetails data={data} />;
      case 'bookmark':
        return <BookmarkDetails data={data} />;
      case 'vms-event':
        return <VMSEventDetails data={data} />;
      case 'recording-server':
        return <RecordingServerDetails data={data} />;
      default:
        return <div>Details not available for this entity type</div>;
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${data.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {renderDetails()}
        </div>
        <div className="modal-footer">
          <div className="last-updated">
            Last Updated: {data.modified ? new Date(data.modified).toLocaleString() : 'N/A'}
          </div>
          <div className="actions">
            <button className="btn btn-secondary" onClick={handleExport}>
              Export JSON
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
