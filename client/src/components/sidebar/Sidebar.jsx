import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import LensIcon from "@mui/icons-material/Lens";
import { NavLink } from "react-router";
import useAuthStore from "../../store/auth-store";
import {
  linksAdmin,
  linksSupervisor,
  linksTechnician,
  linksUser,
} from "../../utils/links";
import Profile from "../navbar/Profile";
const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  console.log(user);
  const getLinksByRole = () => {
    switch (user.role) {
      case "ADMIN":
        return linksAdmin;
      case "SUPERVISOR":
        return linksSupervisor;
      case "TECHNICIAN":
        return linksTechnician;
      case "USER":
        return linksUser;
      default:
        return [];
    }
  };

  const links = getLinksByRole();
  console.log(links);

  return (
    // <nav className="w-72 border">
    <Box sx={{ display: "flex" }}>
      <Drawer
        open={open}
        hideBackdrop={true}
        variant="permanent"
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            backgroundColor: "#111827", // สีพื้นหลังใหม่ (เปลี่ยนตามต้องการ)
            color: "#F3F1F1", // สีข้อความใน Drawer
            overflowX: "hidden",
            height: "100vh",
          },
        }}
      >
        <List>
          <div className="flex items-center p-4 gap-4">
            <Profile />
            <div className="text-lg font-semibold">
              <p>คุณ {user.name}</p>
              <p className="text-xs font-light flex items-center gap-2">
                {" "}
                <LensIcon fontSize="inherit" color="success" />
                Online
              </p>
            </div>
          </div>
        </List>
        <Box sx={{ width: 300 }} role="presentation">
          <Divider color="#FFFFFF" sx={{ height: 2 }} />
          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            {links.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={NavLink}
                  end
                  to={link.href}
                  sx={{
                    justifyContent: "flex-start", // ช่วยให้ข้อความและไอคอนไม่เต็มแผ่น
                    position: "relative",
                    "&.active::before": {
                      content: '""', // สร้าง pseudo-element สำหรับ background
                      position: "absolute",
                      top: 0,
                      left: 8, // ขอบซ้าย
                      right: 8, // ขอบขวา
                      bottom: 0,
                      backgroundColor: "rgba(55, 65, 81, 1)", // สีพื้นหลัง active
                      borderRadius: "10px", // ทำให้ขอบมน
                      zIndex: -1, // อยู่ด้านหลังเนื้อหา
                    },
                    "&:hover::before": {
                      content: '""', // สร้าง pseudo-element สำหรับ background
                      position: "absolute",
                      top: 0,
                      left: 8, // ขอบซ้าย
                      right: 8, // ขอบขวา
                      bottom: 0,
                      backgroundColor: "rgba(55, 65, 81, 0.5)", // สีพื้นหลัง active
                      borderRadius: "10px", // ทำให้ขอบมน
                      zIndex: -1, // อยู่ด้านหลังเนื้อหา
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </Box>
    // </nav>
  );
};

export default Sidebar;
