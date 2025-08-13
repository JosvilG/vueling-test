import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SideMenuComponent } from "./side-menu.component";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";
import { DEFAULT_MENU_OPTIONS, MenuOption } from "./menu-options";

describe("SideMenuComponent", () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  it("debería usar los DEFAULT_MENU_OPTIONS por defecto", () => {
    expect(component.items).toEqual(DEFAULT_MENU_OPTIONS);
  });

  it("debería renderizar un anchor por cada item con routerLink", () => {
    fixture.detectChanges();

    const expectedWithRouter = DEFAULT_MENU_OPTIONS.filter(
      (i) => !!i.routerLink
    ).length;
    const links = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    expect(links.length).toBe(expectedWithRouter);

    const labels = fixture.debugElement
      .queryAll(By.css("a"))
      .map((a) => (a.nativeElement as HTMLAnchorElement).textContent?.trim());

    expect(labels).toEqual(DEFAULT_MENU_OPTIONS.map((o) => o.label));
  });

  it("debería emitir select y actualizar activeIndex al hacer click en un item habilitado", () => {
    const first = DEFAULT_MENU_OPTIONS[0];
    const spy = spyOn(component.select, "emit");

    const ev = { preventDefault: () => {} } as Event;
    component.onClick(first, 0, ev);

    expect(component.activeIndex).toBe(0);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(first);
  });

  it("no debería emitir y debe prevenir cuando el item está disabled", () => {
    const items: MenuOption[] = [
      { label: "Disabled", disabled: true },
      { label: "OK", routerLink: "/ok" },
    ];
    component.items = items;
    fixture.detectChanges();

    const spy = spyOn(component.select, "emit");
    const prevent = jasmine.createSpy("preventDefault");

    component.onClick(items[0], 0, { preventDefault: prevent } as any);

    expect(component.activeIndex).toBe(0);
    expect(prevent).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it("debería tener los hrefs esperados en los RouterLinkWithHref", () => {
    fixture.detectChanges();
    const dirs = fixture.debugElement
      .queryAll(By.directive(RouterLinkWithHref))
      .map((de) => de.injector.get(RouterLinkWithHref));

    const hrefs = dirs.map((d) => d.href);
    const expected = DEFAULT_MENU_OPTIONS.filter((i) => !!i.routerLink).map(
      (i) => String(i.routerLink)
    );

    expect(hrefs).toEqual(expected);
  });

  it("opcional: marca visualmente el item activo (class .is-active)", () => {
    component.activeIndex = 2;
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css(".menu-item"));
    if (items.length) {
      expect(items[2].classes["is-active"]).toBeTrue();
    }
  });
});
