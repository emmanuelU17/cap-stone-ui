import {inject} from "@angular/core";
import {DashboardService} from "../../service/dashboard.service";

export const CLIENT_DASHBOARD_GUARD = () => {
  const service = inject(DashboardService);
  return service.getUser('api/v1/client/auth', '/profile/authentication', false);
}
