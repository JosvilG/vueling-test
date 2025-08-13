import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MenuOption, DEFAULT_MENU_OPTIONS } from "./menu-options";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"],
})
export class SideMenuComponent {
  @Input() items: MenuOption[] = DEFAULT_MENU_OPTIONS;
  @Input() activeIndex: number | null = 0;
  @Output() select = new EventEmitter<MenuOption>();

  onClick(item: MenuOption, i: number, ev: Event) {
    if (item.disabled) {
      ev.preventDefault();
      return;
    }
    this.activeIndex = i;
    this.select.emit(item);
  }
}
