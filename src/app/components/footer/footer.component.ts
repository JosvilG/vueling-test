import { Component, Input } from "@angular/core";
import { FooterLink } from "src/app/core/models/FooterLink";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  @Input() links: FooterLink[] = [
    { label: "Link 1", routerLink: "/link1" },
    { label: "Link 2", routerLink: "/link2" },
    { label: "Link 3", routerLink: "/link3" },
    { label: "Link 4", routerLink: "/link4" },
  ];
}
