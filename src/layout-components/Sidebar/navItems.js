import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import GradeTwoTone from '@material-ui/icons/GradeTwoTone';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import AccountIcon from '@material-ui/icons/AccountBalance';
import SavingsIcon from '@material-ui/icons/SaveAlt';
import FixedDepositIcon from '@material-ui/icons/Lock';

var iconsMap = {
  BarChartIcon: BarChartIcon,
  CalendarTodayIcon: CalendarTodayIcon,
  ChatIcon: ChatIcon,
  CodeIcon: CodeIcon,
  DashboardIcon: DashboardIcon,
  ErrorIcon: ErrorIcon,
  FolderIcon: FolderIcon,
  DashboardTwoToneIcon: DashboardTwoToneIcon,
  GradeTwoTone: GradeTwoTone,
  ListAltIcon: ListAltIcon,
  LockOpenIcon: LockOpenIcon,
  MailIcon: MailIcon,
  PresentToAllIcon: PresentToAllIcon,
  PeopleIcon: PeopleIcon,
  PersonIcon: PersonIcon,
  ReceiptIcon: ReceiptIcon,
  SettingsIcon: SettingsIcon,
  ViewModuleIcon: ViewModuleIcon,
  AccountIcon: AccountIcon,
  SavingsIcon: SavingsIcon,
  FixedDepositIcon: FixedDepositIcon
};

export default [
  {
    label: 'Menu',
    content: JSON.parse(
      `[
  {
    "label": "Dashboard",
    "icon": "DashboardTwoToneIcon",
    "to": "/dashboard"
  },
  {
    "label": "Staff Management",
    "icon": "PersonIcon",
    "content": [
      {
        "label": "Enroll Staff",
        "to": "/enroll-staff"
      },
      {
        "label": "View Staffs",
        "to": "/view-staffs"
      },
      {
        "label": "Staff Permissions",
        "to": "/staff-permissions"
      },
      {
        "label": "Staff Insight",
        "to": "/staff-insight"
      }
    ]
  },
  {
    "label": "Customer Management",
    "icon": "ViewModuleIcon",
    "content": [
      {
        "label": "Register Customer",
        "to": "/register-customer"
      },
      {
        "label": "View Customers",
        "to": "/view-customers"
      },
      {
        "label": "Customer Insight",
        "to": "/customer-insight"
      }
    ]
  },
  {
    "label": "Savings Account",
    "icon": "SavingsIcon",
    "content": [
      {
        "label": "Make Transaction",
        "to": "/make-savings-transaction"
      },
      {
        "label": "View Accounts",
        "to": "/view-savings-account"
      },
      {
        "label": "Transaction History",
        "to": "/savings-transaction-history"
      }
    ]
  },
  {
    "label": "Fixed Deposit Account",
    "icon": "FixedDepositIcon",
    "content": [
      {
        "label": "Add Fixed Deposit",
        "to": "/add-fixed-deposit"
      },
      {
        "label": "View FD Accounts",
        "to": "/view-fixed-deposit-account"
      },
      {
        "label": "Fixed Deposit History",
        "to": "/fixed-deposit-history"
      }
    ]
  },
  {
    "label": "Management Insight",
    "icon": "AccountIcon",
    "content": [
      {
        "label": "Savings Account",
        "to": "/savings-account"
      },
      {
        "label": "Fixed Deposit",
        "to": "/fixed-deposit"
      },
      {
        "label": "Target Savings Account",
        "to": "/target-saings-account"
      },
      {
        "label": "Staff Savings",
        "to": "/staff-savings"
      },
      {
        "label": "Loan",
        "to": "/loan"
      }
    ]
  },
  {
    "label": "Widgets",
    "icon": "ReceiptIcon",
    "content": [
      {
        "label": "Accordions",
        "description": "Accordions represent collapsable component with extended functionality.",
        "to": "/Accordions"
      },
      {
        "label": "Modal dialogs",
        "description": "Wide selection of modal dialogs styles and animations available.",
        "to": "/Modals"
      },
      {
        "label": "Notifications",
        "description": "Show beautiful, animated growl like notifications or alerts on your pages screens.",
        "to": "/Notifications"
      },
      {
        "label": "Popovers",
        "description": "Add small overlay content, like those found in iOS, to any element for housing secondary information.",
        "to": "/Popovers"
      },
      {
        "label": "Tabs",
        "description": "Tabs are used to split content between multiple sections. Wide variety available.",
        "to": "/Tabs"
      }
    ]
  },
  {
    "label": "Regular Tables",
    "icon": "CodeIcon",
    "content": [
      {
        "label": "Tables examples 1",
        "description": "Tables are the backbone of almost all web applications.",
        "to": "/RegularTables1"
      },
      {
        "label": "Tables examples 4",
        "description": "Tables are the backbone of almost all web applications.",
        "to": "/RegularTables4"
      }
    ]
  },
  {
    "label": "Forms Elements",
    "icon": "BarChartIcon",
    "content": [
      {
        "label": "Controls",
        "description": "Wide selection of forms controls, using a standardised code base, specifically for React.",
        "to": "/FormsControls"
      }
    ]
  },
  {
    "label": "Others",
    "icon": "ChatIcon",
    "content": [
      {
        "label": "Apex Charts",
        "description": "Wonderful animated charts built with ApexCharts components.",
        "to": "/ApexCharts"
      },
      {
        "label": "Maps",
        "description": "Implement in your applications Google or vector maps.",
        "to": "/Maps"
      },
      {
        "label": "List Groups",
        "description": "These can be used with other components and elements to create stunning and unique new elements for your UIs.",
        "to": "/ListGroups"
      }
    ]
  }
]`,
      (key, value) => {
        if (key === 'icon') {
          return iconsMap[value];
        } else {
          return value;
        }
      }
    )
  }
];