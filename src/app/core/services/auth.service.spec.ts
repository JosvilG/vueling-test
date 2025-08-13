import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;

  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    spyOn(window.sessionStorage, "getItem").and.callFake((key: string) =>
      key in store ? store[key] : null
    );
    spyOn(window.sessionStorage, "setItem").and.callFake(
      (key: string, value: string) => {
        store[key] = value;
      }
    );
    spyOn(window.sessionStorage, "removeItem").and.callFake((key: string) => {
      delete store[key];
    });

    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it("debería crearse", () => {
    expect(service).toBeTruthy();
  });

  it("estado inicial: sin sesión (username y securityKey nulos)", () => {
    expect(service.getUsername()).toBeNull();
    expect(service.getSecurityKey()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it("login: guarda en sessionStorage y actualiza el estado", () => {
    const emissions: any[] = [];
    const sub = service.state$.subscribe((s) => emissions.push(s));

    service.login("Tester", "abc123");

    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      "auth.username",
      "Tester"
    );
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      "auth.securityKey",
      "abc123"
    );

    expect(service.getUsername()).toBe("Tester");
    expect(service.getSecurityKey()).toBe("abc123");
    expect(service.isLoggedIn()).toBeTrue();

    expect(emissions[emissions.length - 1]).toEqual({
      username: "Tester",
      securityKey: "abc123",
    });
    sub.unsubscribe();
  });

  it("setSecurityKey: actualiza solo la clave y emite nuevo estado", () => {
    service.login("Tester", "old");
    const emissions: any[] = [];
    const sub = service.state$.subscribe((s) => emissions.push(s));
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      "auth.securityKey",
      "newKey"
    );
    expect(service.getUsername()).toBe("Tester");
    expect(service.getSecurityKey()).toBe("newKey");
    expect(service.isLoggedIn()).toBeTrue();
    expect(emissions[emissions.length - 1]).toEqual({
      username: "Tester",
      securityKey: "newKey",
    });
    sub.unsubscribe();
  });

  it("logout: limpia sessionStorage y deja el estado a null", () => {
    service.login("Tester", "abc123");

    const emissions: any[] = [];
    const sub = service.state$.subscribe((s) => emissions.push(s));

    service.logout();

    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(
      "auth.username"
    );
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith(
      "auth.securityKey"
    );

    expect(service.getUsername()).toBeNull();
    expect(service.getSecurityKey()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();

    expect(emissions[emissions.length - 1]).toEqual({
      username: null,
      securityKey: null,
    });
    sub.unsubscribe();
  });

  it("inicializa desde sessionStorage si ya había sesión", () => {
    (window.sessionStorage.getItem as jasmine.Spy).and.callFake(
      (key: string) => {
        if (key === "auth.username") return "Alice";
        if (key === "auth.securityKey") return "dev";
        return null;
      }
    );

    const svc = TestBed.inject(AuthService);
    expect(svc.getUsername()).toBe("Alice");
    expect(svc.getSecurityKey()).toBe("dev");
    expect(svc.isLoggedIn()).toBeTrue();
  });
});
