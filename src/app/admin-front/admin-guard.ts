import {inject} from "@angular/core";
import {DashboardService} from "../service/dashboard.service";

export const AdminGuard = () => {
  const service = inject(DashboardService);
  return service.getUser('api/v1/worker/auth', '/admin', true);
}

export const ADMIN_IS_LOGGED_IN = () => {
  const service = inject(DashboardService);
  return service
    .isLoggedIn('api/v1/worker/auth', '/admin/dashboard', '/admin');
}
