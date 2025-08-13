export interface MenuOption {
  label: string;
  routerLink?: string;
  disabled?: boolean;
  iconRight?: string;
}

export const DEFAULT_MENU_OPTIONS: MenuOption[] = [
  { label: "Menu Item 1", routerLink: "/airports/info" },
  { label: "Menu Item 2", routerLink: "/airports/info2" },
  { label: "Menu Item 3", routerLink: "/airports/info3" },
  { label: "Menu Item 4", routerLink: "/airports/info4" },
  { label: "Menu Item 5", routerLink: "/airports/info5" },
  { label: "Menu Item 6", routerLink: "/airports/info6" },
];
