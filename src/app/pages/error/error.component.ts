import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-error-page",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.scss"],
})
export class ErrorPageComponent {
  code = 404;
  message = "The requested page was not found.";

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParamMap.subscribe((qp) => {
      const c = Number(qp.get("code"));
      const m = qp.get("message");
      if (!Number.isNaN(c)) this.code = c;
      if (m) this.message = m;
    });
  }

  goHome() {
    this.router.navigate(["/airportsList"]);
  }
}
