import { TestBed } from "@angular/core/testing";
import { NavigationService } from "./navigation.service";
import { Router, NavigationExtras } from "@angular/router";
import { Location } from "@angular/common";

describe("NavigationService", () => {
  let service: NavigationService;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(() => {
    router = jasmine.createSpyObj("Router", ["navigate"], {
      url: "/current/url",
    });
    location = jasmine.createSpyObj("Location", ["back"]);

    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: router },
        { provide: Location, useValue: location },
      ],
    });

    service = TestBed.inject(NavigationService);
  });

  it("debería crearse", () => {
    expect(service).toBeTruthy();
  });

  it("to(): navega al path con extras", () => {
    const extras: NavigationExtras = { queryParams: { a: 1 } };
    service.to(["/foo", "bar"], extras);
    expect(router.navigate).toHaveBeenCalledWith(["/foo", "bar"], extras);
  });

  it("replace(): navega con replaceUrl=true (conservando extras)", () => {
    const extras: NavigationExtras = {
      queryParams: { q: "x" },
      fragment: "top",
    };
    service.replace(["/foo"], extras);
    expect(router.navigate).toHaveBeenCalledWith(
      ["/foo"],
      jasmine.objectContaining({
        queryParams: { q: "x" },
        fragment: "top",
        replaceUrl: true,
      })
    );
  });

  describe("back()", () => {
    it("usa Location.back() cuando hay historial", () => {
      spyOnProperty(history, "length", "get").and.returnValue(2);
      service.back(["/fallback"]);
      expect(location.back).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("usa fallback cuando NO hay historial", () => {
      spyOnProperty(history, "length", "get").and.returnValue(1);
      service.back(["/fallback"]);
      expect(location.back).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(["/fallback"]);
    });

    it('usa "/" como fallback por defecto', () => {
      spyOnProperty(history, "length", "get").and.returnValue(0);
      service.back();
      expect(router.navigate).toHaveBeenCalledWith(["/"]);
    });
  });

  it('toHome(): navega a "/"', () => {
    service.toHome();
    expect(router.navigate).toHaveBeenCalledWith(["/"], undefined);
  });

  it('toAirportsList(): navega a "/airports"', () => {
    service.toAirportsList();
    expect(router.navigate).toHaveBeenCalledWith(["/airports"], undefined);
  });

  it('toAirportDetail(): navega a "/airports/:code"', () => {
    service.toAirportDetail("BCN");
    expect(router.navigate).toHaveBeenCalledWith(
      ["/airports", "BCN"],
      undefined
    );
  });

  it("toLogin(true): añade returnUrl actual y mezcla extras", () => {
    (router as any).url = "/airports/BCN";
    service.toLogin(true, { fragment: "x" });
    expect(router.navigate).toHaveBeenCalledWith(
      ["/login"],
      jasmine.objectContaining({
        queryParams: { returnUrl: "/airports/BCN" },
        fragment: "x",
      })
    );
  });

  it("toLogin(false): no añade returnUrl", () => {
    service.toLogin(false, { queryParams: { a: 1 } });
    expect(router.navigate).toHaveBeenCalledWith(
      ["/login"],
      jasmine.objectContaining({ queryParams: { a: 1 } })
    );
  });

  it('toNotFound(): navega a "/404"', () => {
    service.toNotFound();
    expect(router.navigate).toHaveBeenCalledWith(["/404"]);
  });

  it("openExternal(): usa window.open con target", () => {
    const openSpy = spyOn(window, "open");
    service.openExternal("https://example.com", "_blank");
    expect(openSpy).toHaveBeenCalledWith("https://example.com", "_blank");
  });
});
