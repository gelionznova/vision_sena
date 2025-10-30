import { AdminLayout } from "../layouts";
import { UsersAdmin, StudentsAdmin } from "../pages/Admin";
// import { LoginAdmin } from "../pages/Admin";

const routesAdmin = [
  {
    path: "/admin",
    layout: AdminLayout,
    component: UsersAdmin,
    exact: true,
  },

  {
    path: "/admin/students",
    layout: AdminLayout,
    component: StudentsAdmin,
    exact: true,
  }
];

export default routesAdmin;
