import React from 'react';
import InviteesTable from '../components/Planner/InviteeList.jsx/InviteesTable';
import InviteesKpis from '../components/Planner/InviteeList.jsx/InviteesKpis';

function Invitees() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: '1 0 80%' }}>
        <InviteesTable />
      </div>
      <div style={{ flex: '1 0 20%', marginRight: '20px' }}>
        <InviteesKpis />
      </div>
    </div>
  );
}
  
export default Invitees;
