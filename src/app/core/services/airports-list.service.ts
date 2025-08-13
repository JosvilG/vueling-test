import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Airport } from "../models/airport";

@Injectable({ providedIn: "root" })
export class AirportsListService {
  constructor(private http: HttpClient, private router: Router) {}

  public async getAllAirports(): Promise<Airport[] | undefined> {
    const url = "http://localhost:1500/allAirports";
    try {
      return await firstValueFrom(this.http.get<Airport[]>(url));
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  public async getAirport(airportKey: string): Promise<Airport | undefined> {
    const url = "http://localhost:1500/airport";
    try {
      return await firstValueFrom(
        this.http.post<Airport>(url, { key: airportKey })
      );
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  private handleError(err: unknown) {
    const e = err as HttpErrorResponse;
    if (e?.status === 404) {
      this.router.navigate(["/error"], {
        queryParams: { code: 404, message: "Airport not found" },
        replaceUrl: true,
      });
    }
  }
}
