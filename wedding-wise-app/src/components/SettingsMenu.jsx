import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { taskSettings } from "../utilities/collections";
import { Tooltip } from "@mui/material";

export default function SettingsMenu({ onAddComment, onDeleteTask }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(false);
  };

  function handleOptionSelected(optionId) {
    switch (optionId) {
      case 1:
        onAddComment();
        break;
      case 2:
        onDeleteTask();
        break;
      default:
        break;
    }
    setAnchorEl(false);
  }

  return (
    <div>
      <Tooltip title="הגדרות">
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {taskSettings.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleOptionSelected(option.id)}
          >
            {option.text}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
