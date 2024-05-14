import React, { useContext } from 'react';
import { AppContext } from '../../../store/AppContext'; 

function InviteesKpis() {
    const { invitees } = useContext(AppContext);
  
    const totalInvitees = invitees.reduce((acc, invitee) => acc + parseInt(invitee.numberOfInvitees, 10), 0);
    const rsvpYes = invitees.filter(invitee => invitee.rsvp === 'כן').reduce((acc, invitee) => acc + parseInt(invitee.numberOfInvitees, 10), 0);
    const brideSide = invitees.filter(invitee => invitee.side === 'כלה').reduce((acc, invitee) => acc + parseInt(invitee.numberOfInvitees, 10), 0);
    const groomSide = invitees.filter(invitee => invitee.side === 'חתן').reduce((acc, invitee) => acc + parseInt(invitee.numberOfInvitees, 10), 0);
  
    return (
      <div style={{ marginRight: '20px' }}>
        <div>מספר אורחים: {totalInvitees}</div>
        <div>אישרו הגעה: {rsvpYes}</div>
        <div>צד כלה: {brideSide}</div>
        <div>צד חתן: {groomSide}</div>
      </div>
    );
  }
  
  export default InviteesKpis;