import {inject} from "@angular/core";
import {DashboardService} from "./dashboard/dashboard.service";

export const authGuard = () => {
  const dashboardService: DashboardService = inject(DashboardService);
  return dashboardService.getUser();
}
