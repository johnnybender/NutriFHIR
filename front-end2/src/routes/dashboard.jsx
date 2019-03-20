import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Maps from "views/Maps/Maps";
import Notifications from "views/Notifications/Notifications";
import Upgrade from "views/Upgrade/Upgrade";
import LaunchProvider from "views/LaunchProvider/LaunchProvider";
import Summary from "views/Summary/Summary";
import Patient from "views/Patient/Patient";
import Medications from "views/Medications/Medications";
import Diet from "views/Diet/Diet";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: '/launchProvider',
    name: "Launch Provider",
    icon: "pe-7s-user",
    component: LaunchProvider,
    noSidebar: true
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "pe-7s-user",
    component: UserProfile,
    noSidebar: true
  },
  {
    path: "/patient",
    name: "Patient",
    icon: "pe-7s-user",
    component: Patient
  },
  {
    path: "/diet",
    name: "Diet",
    icon: "pe-7s-note2",
    component: Diet
  },
  {
    path: "/medications",
    name: "Medications",
    icon: "pe-7s-science",
    component: Medications
  },
  {
    path: "/table",
    name: "Table List",
    icon: "pe-7s-note2",
    component: TableList,
    noSidebar: true
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "pe-7s-news-paper",
    component: Typography,
    noSidebar: true
  },
  { path: "/icons", name: "Icons", icon: "pe-7s-science", component: Icons, noSidebar: true},
  { path: "/maps", name: "Environment", icon: "pe-7s-map-marker", component: Maps},
  {
    path: "/notifications",
    name: "Notifications",
    icon: "pe-7s-bell",
    component: Notifications,
    noSidebar: true
  },
  {
    upgrade: true,
    path: "/upgrade",
    name: "Upgrade to PRO",
    icon: "pe-7s-rocket",
    component: Upgrade,
    noSidebar: true
  },
  {
    path: "/summary",
    name: "summary",
    icon: "pe-7s-rocket",
    component: Summary,
    noSidebar: true
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
