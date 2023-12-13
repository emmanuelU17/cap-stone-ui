import {inject} from "@angular/core";
import {AuthService} from "../service/auth.service";

export const AdminGuard = () => {
  const service = inject(AuthService);
  return service.activeUser('api/v1/worker/auth', '/admin', true);
}
