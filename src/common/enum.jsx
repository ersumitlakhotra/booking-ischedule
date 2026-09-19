import { Badge } from "../controls/index.jsx";
import { Boxes, Calendar, ClipboardClock, Home, Layers, LayoutDashboard, List,  Logs,  Percent, Settings,   User, UsersRound } from "lucide-react";

export const APPOINTMENT_STATUS_OPTIONS = [
  {id:0, value: "All", label: "All" ,color:'blue'},
  {id:1, value: "Awaiting", label:"Awaiting" ,color:'gray'},
  {id:2, value: "Pending", label: "Pending" ,color:'yellow'},
  {id:3, value: "Completed", label:"Completed" ,color:'green' },
  {id:4, value: "Cancelled", label:"Cancelled",color:'red' },
  {id:5, value: "Rejected", label:"Rejected",color:'red' },
  {id:6, value: "NoShow", label:"No Show" ,color:'red' },
];

export const EMAIL_STATUS = {
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    RESCHEDULED: "Rescheduled",
    REJECTED: "Rejected",
    AWAITING: "Awaiting",
} 

export const FOOTER_ICONS = [
  { id: 1, label: "Dashboard", navigate: "/Dashboard", permission: "Dashboard.Open", color: "bg-blue-500", icon: Home },
  { id: 2, label: "Appointments", navigate: "/Appointment", permission: "Appointment.Open", color: "bg-orange-300", icon: LayoutDashboard  },
  { id: 3, label: "Calendar", navigate: "/Calender", permission: "Calender.Open", color: "bg-blue-900", icon: Calendar  },
  { id: 4, label: "Discount", navigate: "/Discount", permission: "Discount.Open", color: "bg-gradient-to-b from-[#8a2ce2] via-[#4a0080] to-[#1f8fff]", icon: Percent  },
  { id: 5, label: "Customers", navigate: "/Customers", permission: "Customers.Open", color: "bg-gradient-to-r from-red-400 to-pink-800 ", icon: UsersRound  },
  { id: 6, label: "Services", navigate: "/Services", permission: "Services.Open", color: "bg-gradient-to-r from-[#D6B588] to-orange-600", icon: Logs},
  { id: 7, label: "Inventory", navigate: "/Inventory", permission: "Inventory.Open", color: "bg-gradient-to-br from-cyan-400 to-cyan-800", icon: Boxes },
  { id: 8, label: "Employees", navigate: "/Employee", permission: "Employees.Open", color: "bg-gradient-to-r from-red-900 to-purple-600", icon: User},
  { id: 9, label: "Attendance", navigate: "/Attendance", permission: "Attendance.Open", color: "bg-gradient-to-r from-green-500 to-green-900", icon: ClipboardClock },
 // { id: 10, label: "Reports", navigate: "/Reports", permission: "Reports.Open", color: "bg-fuchsia-600", icon: Layers },
  { id: 11, label: "Setting", navigate: "/Setting", permission: "Setting.Open", color: "bg-gray-600", icon: Settings },
];

export const PLANS = [
    { key: 1, name: "FREE TRIAL", monthly: 0.00, title: 'Get Started For Free',
        features: [
            "Appointment Records",
            "Clean, Data Management",
            "Inventory Management",
            "Employee Performance",
            "Portal and Mobile Application",
            "Prioritized Support"
        ]
    },
    { key: 2, name: "STANDARD", monthly: 49.99, title: 'Start Standard Plan', badge: "Recommended",
        features: [
            "Appointment Records",
            "Clean, Data Management",
            "Inventory Management",
            "Employee Performance",
            "Portal and Mobile Application",
            "Prioritized Support",
            "Text Messages (Paid)"
        ]
    },
    { key: 3, name: "ENTERPRISE", monthly: 89.99, title: 'Start Enterprise Plan',
        features: [
            "Appointment Records",
            "Clean, Data Management",
            "Inventory Management",
            "Employee Performance",
            "Portal and Mobile Application",
            "Prioritized Support",
            "Text Messages (Paid)",
            "Custom Website"
        ]
    }
];
