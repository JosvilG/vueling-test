import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loading = false;

  form = this.fb.group({
    username: ["Tester", [Validators.required, Validators.minLength(2)]],
    securityKey: [this.randKey(), [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const { username, securityKey } = this.form.value as {
      username: string;
      securityKey: string;
    };
    this.auth.login(username, securityKey);

    const returnUrl =
      this.route.snapshot.queryParamMap.get("returnUrl") || "/airportsList";
    this.router.navigateByUrl(returnUrl, { replaceUrl: true });
  }

  fillDemo(): void {
    this.form.setValue({ username: "Demo User", securityKey: "dev" });
  }

  private randKey() {
    return Math.random().toString(36).slice(2, 10);
  }
}
