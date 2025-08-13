import { TestBed } from "@angular/core/testing";
import { AirportsListService } from "./airports-list.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";

describe("AirportsListService", () => {
  let service: AirportsListService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  const API_ALL = "http://localhost:1500/allAirports";
  const API_ONE = "http://localhost:1500/airport";

  beforeEach(() => {
    router = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AirportsListService, { provide: Router, useValue: router }],
    });

    service = TestBed.inject(AirportsListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("se crea", () => {
    expect(service).toBeTruthy();
  });

  it("getAllAirports() hace GET y resuelve con la lista", async () => {
    const promise = service.getAllAirports();

    const req = httpMock.expectOne(API_ALL);
    expect(req.request.method).toBe("GET");
    req.flush([{ key: "BCN" }]);

    await expectAsync(promise).toBeResolvedTo([{ key: "BCN" } as any]);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("getAllAirports() rechaza en 500 y NO navega", async () => {
    const p = service.getAllAirports();

    const req = httpMock.expectOne(API_ALL);
    req.flush("err", { status: 500, statusText: "Server Error" });

    await expectAsync(p).toBeRejected();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("getAirport() hace POST con body {key} y resuelve", async () => {
    const p = service.getAirport("BCN");

    const req = httpMock.expectOne(API_ONE);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ key: "BCN" });
    req.flush({ key: "BCN" });

    await expectAsync(p).toBeResolvedTo({ key: "BCN" } as any);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("getAirport() en 404 navega a /error y rechaza", async () => {
    const p = service.getAirport("ZZZ");

    const req = httpMock.expectOne(API_ONE);
    req.flush("not found", { status: 404, statusText: "Not Found" });

    await expectAsync(p).toBeRejected();
    expect(router.navigate).toHaveBeenCalledWith(
      ["/error"],
      jasmine.objectContaining({
        queryParams: { code: 404, message: "Airport not found" },
        replaceUrl: true,
      })
    );
  });
});
