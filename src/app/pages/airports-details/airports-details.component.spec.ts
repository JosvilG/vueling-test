import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flushMicrotasks,
} from "@angular/core/testing";
import { AirportDetailComponent } from "./airports-details.component";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { of, Subject } from "rxjs";
import { ViewportScroller } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AirportsListService } from "../../core/services/airports-list.service";

describe("AirportDetailComponent", () => {
  let fixture: ComponentFixture<AirportDetailComponent>;
  let component: AirportDetailComponent;

  let routeParam$!: Subject<any>;
  let airportsSvc!: jasmine.SpyObj<AirportsListService>;
  let scroller!: jasmine.SpyObj<ViewportScroller>;

  beforeEach(async () => {
    routeParam$ = new Subject();
    airportsSvc = jasmine.createSpyObj("AirportsListService", ["getAirport"]);
    scroller = jasmine.createSpyObj("ViewportScroller", ["scrollToPosition"]);

    await TestBed.configureTestingModule({
      declarations: [AirportDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ code: "BCN" }) },
            paramMap: routeParam$.asObservable(),
          },
        },
        { provide: AirportsListService, useValue: airportsSvc },
        { provide: ViewportScroller, useValue: scroller },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportDetailComponent);
    component = fixture.componentInstance;
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  it("hace scroll al top al iniciar y cuando cambia el paramMap", () => {
    airportsSvc.getAirport.and.returnValue(
      Promise.resolve({ key: "BCN" } as any)
    );

    fixture.detectChanges();

    expect(scroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);

    routeParam$.next(convertToParamMap({ code: "BCN" }));
    expect(scroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
    expect(scroller.scrollToPosition).toHaveBeenCalledTimes(2);
  });

  it("carga el aeropuerto con el code de la ruta y desactiva loading al resolver", fakeAsync(() => {
    const airport = {
      key: "BCN",
      name: "El Prat",
      city: "Barcelona",
      country: "Spain",
    } as any;
    airportsSvc.getAirport.and.returnValue(Promise.resolve(airport));

    fixture.detectChanges();
    expect(airportsSvc.getAirport).toHaveBeenCalledWith("BCN");

    flushMicrotasks();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.airport).toEqual(airport);
  }));

  it("si el servicio rechaza, guarda error y desactiva loading", fakeAsync(() => {
    airportsSvc.getAirport.and.returnValue(Promise.reject(new Error("boom")));

    fixture.detectChanges();
    expect(airportsSvc.getAirport).toHaveBeenCalledWith("BCN");

    flushMicrotasks();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe("boom");
    expect(component.airport).toBeUndefined();
  }));

  it("si falta el parámetro :code, no llama al servicio y muestra error", () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot = { paramMap: convertToParamMap({}) };

    fixture = TestBed.createComponent(AirportDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.code).toBe("");
    expect(component.loading).toBeFalse();
    expect(component.error).toBe("Airport code not provided");
    expect(airportsSvc.getAirport).not.toHaveBeenCalled();
  });
});
