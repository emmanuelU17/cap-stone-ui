import {inject} from "@angular/core";
import {AuthService} from "@/app/service/auth.service";

export const CLIENT_DASHBOARD_GUARD = () => {
  const service = inject(AuthService);
  return service.activeUser('api/v1/auth/client', '/account/authentication', false);
}
