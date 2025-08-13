import { Injectable } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Location } from "@angular/common";

@Injectable({ providedIn: "root" })
export class NavigationService {
  constructor(private router: Router, private location: Location) {}

  to(path: any[], extras?: NavigationExtras) {
    return this.router.navigate(path, extras);
  }

  replace(path: any[], extras?: NavigationExtras) {
    return this.router.navigate(path, { ...extras, replaceUrl: true });
  }

  back(fallback: any[] = ["/"]) {
    if (history.length > 1) this.location.back();
    else this.router.navigate(fallback);
  }

  toHome(extras?: NavigationExtras) {
    return this.router.navigate(["/"], extras);
  }

  toAirportsList(extras?: NavigationExtras) {
    return this.router.navigate(["/airports"], extras);
  }

  toAirportDetail(code: string, extras?: NavigationExtras) {
    return this.router.navigate(["/airports", code], extras);
  }

  toLogin(redirectToCurrent = true, extras?: NavigationExtras) {
    const merged: NavigationExtras = redirectToCurrent
      ? { queryParams: { returnUrl: this.router.url }, ...extras }
      : extras ?? {};
    return this.router.navigate(["/login"], merged);
  }

  toNotFound() {
    return this.router.navigate(["/404"]);
  }

  openExternal(url: string, target: "_self" | "_blank" = "_self") {
    window.open(url, target);
  }
}
