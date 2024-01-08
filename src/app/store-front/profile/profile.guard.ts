import {inject} from "@angular/core";
import {AuthService} from "../../service/auth.service";

export const CLIENT_DASHBOARD_GUARD = () => {
  const service = inject(AuthService);
  return service.activeUser('api/v1/client/auth', '/account/authentication', false);
}
