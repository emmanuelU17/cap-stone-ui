import {ProfileService} from "./profile.service";
import {inject} from "@angular/core";

export const userDashBoardGuard = () => {
  const profileService: ProfileService = inject(ProfileService);
  return profileService.getActiveUser();
}
