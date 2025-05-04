import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: "1px solid gray", // ขอบสีดำเริ่มต้น
  "&:hover": {
    borderColor: "black",
  },
  "&:focus-within": {
    borderColor: "blue", // เปลี่ยนเป็นสีฟ้าเมื่อ Input ถูก focus
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const SearchBar = ({ value, onChange }) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="ค้นหา..."
        value={value}
        onChange={onChange}
        inputProps={{ "aria-label": "search" }}
      />
    </Search>
  );
};

export default SearchBar;
