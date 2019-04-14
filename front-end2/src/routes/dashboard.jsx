import Dashboard from "views/Dashboard/Dashboard";
import Maps from "views/Maps/Maps";
import LaunchProvider from "views/LaunchProvider/LaunchProvider";
import Summary from "views/Summary/Summary";
import Patient from "views/Patient/Patient";
import Medications from "views/Medications/Medications";
import Procedures from "views/Procedures/Procedures";
import ClinicalNotes from "views/ClinicalNotes/ClinicalNotes";
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
    path: "/procedures",
    name: "Procedures",
    icon: "pe-7s-date",
    component: Procedures
  },
  {
    path: "/clinicalNotes",
    name: "Clinical Notes",
    icon: "pe-7s-note",
    component: ClinicalNotes
  },
  { path: "/maps", name: "Environment", icon: "pe-7s-map-marker", component: Maps},
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
