import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AirportsListComponent } from "./airports-list.component";
import { AirportsListService } from "src/app/core/services/airports-list.service";
import { NavigationService } from "src/app/core/services/navigation.service";

describe("AirportsListComponent", () => {
  let fixture: ComponentFixture<AirportsListComponent>;
  let component: AirportsListComponent;

  let airportsSvc: jasmine.SpyObj<AirportsListService>;
  let navSvc: jasmine.SpyObj<NavigationService>;

  const mockAirports = [
    { key: "BCN", name: "Barcelona", city: "Barcelona", country: "Spain" },
    { key: "MAD", name: "Madrid", city: "Madrid", country: "Spain" },
  ] as any[];

  beforeEach(async () => {
    airportsSvc = jasmine.createSpyObj("AirportsListService", [
      "getAllAirports",
    ]);
    navSvc = jasmine.createSpyObj("NavigationService", ["toAirportDetail"]);

    await TestBed.configureTestingModule({
      declarations: [AirportsListComponent],
      providers: [
        { provide: AirportsListService, useValue: airportsSvc },
        { provide: NavigationService, useValue: navSvc },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  function mockFetchOK(title = "Lorem", desc = "Hello <b>World</b>") {
    spyOn(window, "fetch").and.returnValue(
      Promise.resolve({
        json: () =>
          Promise.resolve({ sectionTitle: title, sectionDescription: desc }),
      } as any)
    );
  }

  it("debería crearse", () => {
    fixture = TestBed.createComponent(AirportsListComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it("carga aeropuertos y textos en ngOnInit (éxito)", fakeAsync(() => {
    airportsSvc.getAllAirports.and.returnValue(Promise.resolve(mockAirports));
    mockFetchOK();

    fixture = TestBed.createComponent(AirportsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    expect(airportsSvc.getAllAirports).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith("assets/dummy-texts.json");

    expect(component.airportsList).toEqual(mockAirports);
    expect(component.error).toBeUndefined();
    expect(component.sectionTitle).toBe("Lorem");
    expect(component.sectionDescriptionHtml).toBeTruthy();
  }));

  it("setea error si falla la carga de aeropuertos", fakeAsync(() => {
    airportsSvc.getAllAirports.and.returnValue(
      Promise.reject(new Error("boom"))
    );
    mockFetchOK();

    fixture = TestBed.createComponent(AirportsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    expect(component.airportsList).toBeUndefined();
    expect(component.error).toBe("boom");
  }));

  it("no rompe si falla fetch de dummy-texts.json (loggea en consola)", fakeAsync(() => {
    airportsSvc.getAllAirports.and.returnValue(Promise.resolve(mockAirports));
    spyOn(window, "fetch").and.returnValue(
      Promise.reject(new Error("fetch failed"))
    );
    const consoleSpy = spyOn(console, "error");

    fixture = TestBed.createComponent(AirportsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    flushMicrotasks();
    fixture.detectChanges();

    expect(component.airportsList).toEqual(mockAirports);
    expect(consoleSpy).toHaveBeenCalled();
    expect(component.sectionTitle).toBe("");
  }));

  it("clickAirport navega a detalle con el código", () => {
    fixture = TestBed.createComponent(AirportsListComponent);
    component = fixture.componentInstance;

    component.clickAirport("BCN");
    expect(navSvc.toAirportDetail).toHaveBeenCalledWith("BCN");
  });
});
