import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../store/AppContext";
import InviteesNoUser from "../components/Planner/InviteeList/InviteesNoUser";
import InviteesTable from "../components/Planner/InviteeList/InviteesTable";
import InviteesKpis from "../components/Planner/InviteeList/InviteesKpis";
import useFetch from "../utilities/useFetch";

function Invitees() {
  const { coupleData, setInvitees } = useContext(AppContext);

  const { data: inviteesData, loading, error } = useFetch(`/api/invitees?couple_email=${coupleData?.email}`, {});

  useEffect(() => {
    if (inviteesData) {
      setInvitees(inviteesData);
    }
  }, [inviteesData, setInvitees]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: "1 0 80%" }}>
        {coupleData === null || inviteesData === null ? (
          <InviteesNoUser />
        ) : (
          <InviteesTable />
        )}
      </div>
      <div style={{ flex: "1 0 20%", marginRight: "20px" }}>
        {inviteesData !== null && <InviteesKpis />}
      </div>
    </div>
  );
}

export default Invitees;
