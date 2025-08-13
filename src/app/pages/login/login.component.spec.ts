import { TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute, convertToParamMap } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AuthService } from "src/app/core/services/auth.service";

describe("LoginComponent", () => {
  let component: LoginComponent;

  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: Partial<ActivatedRoute>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj("AuthService", ["login"]);
    router = jasmine.createSpyObj("Router", ["navigateByUrl"]);

    route = {
      snapshot: { queryParamMap: convertToParamMap({}) },
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  it('inicializa el formulario con username "Tester" y securityKey generado', () => {
    const val = component.form.value as any;
    expect(val.username).toBe("Tester");
    expect(typeof val.securityKey).toBe("string");
    expect(val.securityKey.length).toBe(8);
  });

  it("validaciones: username requerido y minLength(2); securityKey requerido", () => {
    component.form.setValue({ username: "", securityKey: "" });
    expect(component.form.invalid).toBeTrue();
    expect(component.form.controls["username"].hasError("required")).toBeTrue();
    expect(
      component.form.controls["securityKey"].hasError("required")
    ).toBeTrue();

    component.form.patchValue({ username: "A", securityKey: "x" });
    expect(
      component.form.controls["username"].hasError("minlength")
    ).toBeTrue();

    component.form.patchValue({ username: "OK" });
    expect(component.form.valid).toBeTrue();
  });

  it("submit() con formulario inválido: marca touched y no navega ni loguea", () => {
    const markSpy = spyOn(component.form, "markAllAsTouched").and.callThrough();
    component.form.setValue({ username: "", securityKey: "" });

    component.submit();

    expect(markSpy).toHaveBeenCalled();
    expect(auth.login).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it("submit() válido: llama a auth.login y navega a /airportsList por defecto", () => {
    component.form.setValue({ username: "User", securityKey: "dev" });
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    component.submit();

    expect(auth.login).toHaveBeenCalledWith("User", "dev");
    expect(router.navigateByUrl).toHaveBeenCalledWith("/airportsList", {
      replaceUrl: true,
    });
    expect(component.loading).toBeTrue();
  });

  it("submit() con returnUrl en query: navega al returnUrl", () => {
    const ar = TestBed.inject(ActivatedRoute) as any;
    ar.snapshot = {
      queryParamMap: convertToParamMap({ returnUrl: "/airports/BCN" }),
    };

    component.form.setValue({ username: "User", securityKey: "dev" });
    router.navigateByUrl.and.returnValue(Promise.resolve(true));

    component.submit();

    expect(auth.login).toHaveBeenCalledWith("User", "dev");
    expect(router.navigateByUrl).toHaveBeenCalledWith("/airports/BCN", {
      replaceUrl: true,
    });
  });

  it("fillDemo(): rellena el formulario con valores demo", () => {
    component.form.reset();
    component.fillDemo();
    expect(component.form.value).toEqual({
      username: "Demo User",
      securityKey: "dev",
    });
  });
});
