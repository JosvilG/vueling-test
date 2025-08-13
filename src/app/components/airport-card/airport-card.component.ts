import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-airport-card",
  templateUrl: "./airport-card.component.html",
  styleUrls: ["./airport-card.component.scss"],
})
export class AirportCardComponent {
  @Input() name!: string;
  @Input() code!: string;
  @Input() city!: string;
  @Input() country!: string;

  @Output() select = new EventEmitter<string>();

  onClick() {
    this.select.emit(this.code);
  }
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this.select.emit(this.code);
    }
  }
}
