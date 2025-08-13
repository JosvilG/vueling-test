import { Component, EventEmitter, Input, Output } from "@angular/core";

type BtnVariant = "primary" | "secondary" | "outline";
type BtnSize = "sm" | "md" | "lg";

@Component({
  selector: "app-button",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.scss"],
})
export class ButtonComponent {
  @Input() href?: string;
  @Input() routerLink?: string | any[];
  @Input() target: "_self" | "_blank" = "_self";
  @Input() type: "button" | "submit" | "reset" = "button";
  @Input() disabled = false;

  @Input() variant: BtnVariant = "primary";
  @Input() size: BtnSize = "md";
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get rel(): string | null {
    return this.target === "_blank" ? "noopener noreferrer" : null;
  }

  onClick(ev: MouseEvent) {
    if (this.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }
    this.clicked.emit(ev);
  }

  get classes() {
    return {
      btn: true,
      ["btn--" + this.variant]: true,
      ["btn--" + this.size]: true,
      "btn--full": this.fullWidth,
    };
  }
}
