import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import WorkIcon from "@mui/icons-material/Work";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
export const linksAdmin = [
  { href: "/admin", label: "หน้าหลัก", icon: <HomeIcon /> },
  {
    href: "/admin/manage-user",
    label: "จัดการสมาชิก",
    icon: <ManageAccountsIcon />,
  },
  {
    href: "/admin/manage-position",
    label: "จัดการตำแหน่ง",
    icon: <WorkIcon />,
  },
  {
    href: "/admin/manage-department",
    label: "จัดการแผนก",
    icon: <AccountTreeIcon />,
  },
  {
    href: "/admin/manage-category",
    label: "จัดการหมวดหมู่อุปกรณ์",
    icon: <CategoryIcon />,
  },
  {
    href: "/admin/manage-equipment",
    label: "จัดการอุปกรณ์",
    icon: <HomeRepairServiceIcon />,
  },
];

export const linksSupervisor = [
  { href: "/supervisor", label: "หน้าหลัก", icon: <HomeIcon /> },
  // {
  //   href: "/supervisor/history-repair",
  //   label: "ประวัติการซ่อม",
  //   icon: <ArticleIcon />,
  // },
  {
    href: "/supervisor/historys",
    label: "ประวัติการซ่อมทั้งหมด",
    icon: <LibraryBooksIcon />,
  },
  {
    href: "/supervisor/manage-technician",
    label: "จัดการสมาชิก",
    icon: <ManageAccountsIcon />,
  },
];

export const linksTechnician = [
  { href: "/technician", label: "หน้าหลัก", icon: <HomeIcon /> },
  {
    href: "/technician/history",
    label: "ประวัติการซ่อม",
    icon: <ArticleIcon />,
  },
  {
    href: "/technician/historys",
    label: "ประวัติการซ่อมทั้งหมด",
    icon: <LibraryBooksIcon />,
  },
];

export const linksUser = [
  { href: "/user", label: "หน้าหลัก", icon: <HomeIcon /> },
  { href: "/user/report-repair", label: "แจ้งซ่อม", icon: <NoteAddIcon /> },
  {
    href: "/user/history-report",
    label: "ประวัติการแจ้งซ่อม",
    icon: <ArticleIcon />,
  },
];
