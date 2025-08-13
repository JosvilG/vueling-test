import { Component, OnInit } from "@angular/core";

import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Airport } from "src/app/core/models/airport";
import { DummyTexts } from "src/app/core/models/DummyTexts";
import { AirportsListService } from "src/app/core/services/airports-list.service";
import { NavigationService } from "src/app/core/services/navigation.service";

@Component({
  selector: "app-airports-list",
  templateUrl: "./airports-list.component.html",
  styleUrls: ["./airports-list.component.scss"],
})
export class AirportsListComponent implements OnInit {
  public airportsList?: Airport[];
  public error?: string;

  public sectionTitle = "";
  public sectionDescriptionHtml?: SafeHtml;

  constructor(
    private airportsListService: AirportsListService,
    private sanitizer: DomSanitizer,
    private navigation: NavigationService
  ) {}

  public ngOnInit(): void {
    this.loadAirports();
    this.loadDummyTexts();
  }

  private loadAirports(): void {
    this.airportsListService
      .getAllAirports()
      .then((res) => {
        this.airportsList = res;
      })
      .catch((error) => {
        this.error = error.message;
      });
  }

  private async loadDummyTexts(): Promise<void> {
    try {
      const res = await fetch("assets/dummy-texts.json");
      const data: DummyTexts = await res.json();
      this.sectionTitle = data.sectionTitle;
      this.sectionDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(
        data.sectionDescription
      );
    } catch (err) {
      console.error("Error cargando dummy-texts.json", err);
    }
  }

  public clickAirport(key: string): void {
    this.navigation.toAirportDetail(key);
  }

  public onMenuSelect(item: any): void {
    console.log("Menú seleccionado:", item);
  }
}
