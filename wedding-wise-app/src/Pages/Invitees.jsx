import React, { useContext, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { AppContext } from "../store/AppContext";
import InviteesTable from "../components/Planner/InviteeList/InviteesTable";
import InviteesKpis from "../components/Planner/InviteeList/InviteesKpis";
import useFetch from "../utilities/useFetch";
import { customTheme } from "../store/Theme";

function Invitees() {
  const { coupleData, setInvitees } = useContext(AppContext);

  const {
    data: inviteesData,
    loading,
    error,
  } = useFetch(`/api/invitees?couple_email=${coupleData?.email}`, {});

  useEffect(() => {
    if (inviteesData) {
      setInvitees(inviteesData);
    }
  }, [inviteesData, setInvitees]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack alignItems="center" sx={loginStackSX}>
      <Typography sx={titleSX}>ניהול מוזמנים</Typography>
      <Typography
        sx={{
          fontSize: { xs: 18, sm: 22, md: 28 },
          textAlign: "center",
          p: { xs: 1, sm: 3 },
          mb: { xs: 5, sm: 8 },
          width: { xs: "80%", sm: "70%", md: "60%" },
        }}
      >
        טבלת המוזמנים מאפשרת לכם להוסיף, לעדכן ולמחוק מוזמנים בקלות, עם תצוגה
        ברורה של כמות המוזמנים בכל רגע נתון, כך שתמיד תהיו מעודכנים.
      </Typography>
      <Stack sx={{ width: "80%", pb: 5 }}>
        {inviteesData !== null && <InviteesKpis />}
      </Stack>
      <Stack sx={{ width: "80%" }}>
        <InviteesTable />
      </Stack>
    </Stack>
  );
}

export default Invitees;

const loginStackSX = {
  // minHeight: "inherit",
  pb: 10,
  width: { xs: "95%", sm: "85%" },
  margin: "0 auto",
};

const titleSX = {
  textAlign: "center",
  fontSize: { xs: 30, sm: 45, md: 65 },
  fontFamily: customTheme.font.main,
  fontWeight: "bold",
  color: customTheme.palette.primary.main,
  WebkitTextStrokeWidth: { xs: 1.5, sm: 0.7 },

  // textDecoration: "underline",
  // WebkitTextStrokeColor: "black",
};
