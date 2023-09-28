import {inject} from "@angular/core";
import {DashboardService} from "./dashboard/dashboard.service";

export const adminFrontAuthGuard = () => {
  const dashboardService: DashboardService = inject(DashboardService);
  return dashboardService.getUser();
}
