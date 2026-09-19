/* eslint-disable new-cap */
import './css/App.css';
import './css/styles.css';
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";

import { AlertProvider} from './controls/AlertProvider.jsx'
import ProtectedRoute from './auth/protectedRoute.js';
import ProtectedLayout from './auth/protectedLayout.js';
import { Index } from './pages/index.jsx';
import { CreateEditCancel } from './pages/Appointment/create_edit.jsx';
import { Main } from './pages/main.jsx';
import ServiceView from './pages/Services/service_view.jsx';
import { AuthProvider } from './auth/authContext.js';
import EmployeeView from './pages/Employee/employee_view.jsx';
import AppointmentView from './pages/Appointment/appointment_view.jsx';
import CancelAppointment from './pages/Appointment/cancel.jsx';
import CouponView from './pages/Home/discount_view.jsx';

function App() {
 const routes = [
    { path: "/Main", element: <Main />, permission: "View" },
    { path: "/Service/View/:Id", element: <ServiceView />, permission: "View" },
    { path: "/Employee/View/:Id", element: <EmployeeView />, permission: "View" },
    { path: "/Create", element: <CreateEditCancel />, permission: "Create" },
    { path: "/View/:Id", element: <AppointmentView />, permission: "View" },
    { path: "/Reschedule/:Id", element: <CreateEditCancel />, permission: "Edit" },
    { path: "/Cancel/:Id", element: <CancelAppointment />, permission: "Edit" }, 
    { path: "/Coupon/:Id", element: <CouponView />, permission: "View" },
  ];

  return (
     <AuthProvider>
      <BrowserRouter>
        <AlertProvider>
          <Routes>
            <Route path="/:Id" element={<Index />} />

            {routes.map((route) => (
              <Route key={route.path} element={<ProtectedRoute permission={route.permission} />} >
                <Route element={<ProtectedLayout />}>
                  <Route path={route.path} element={route.element} />
                </Route>
              </Route>
            ))}
            
          </Routes>
        </AlertProvider>
      </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
