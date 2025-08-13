import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  username: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.auth.state$.subscribe((s) => (this.username = s.username));
  }

  onBack(): void {
    if (history.length > 1) history.back();
    else this.router.navigate(["/airportsList"]);
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(["/login"], { replaceUrl: true });
  }
}
