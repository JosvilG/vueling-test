import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input() b = 5;

  @Input() label = "Loading...";

  @Input() fullscreen = false;
}
