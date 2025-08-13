import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AirportsListService } from "../../core/services/airports-list.service";
import { Airport } from "../../core/models/airport";
import { ViewportScroller } from "@angular/common";

interface AirportDetail extends Airport {
  owner?: string;
  build?: string;
  image?: string;
}

@Component({
  selector: "app-airport-detail",
  templateUrl: "./airports-details.component.html",
  styleUrls: ["./airports-details.component.scss"],
})
export class AirportDetailComponent implements OnInit {
  loading = true;
  error: string | null = null;
  code = "";
  airport?: AirportDetail;

  constructor(
    private route: ActivatedRoute,
    private airports: AirportsListService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.scroller.scrollToPosition([0, 0]);
    this.route.paramMap.subscribe(() => this.scroller.scrollToPosition([0, 0]));

    this.code = this.route.snapshot.paramMap.get("code") || "";
    if (!this.code) {
      this.error = "Airport code not provided";
      this.loading = false;
      return;
    }

    this.loading = true;
    this.airports
      .getAirport(this.code)
      .then((data) => {
        this.airport = data as any;
        this.loading = false;
      })
      .catch((err) => {
        this.error = err?.message || "Error loading airport";
        this.loading = false;
      });
  }
}
