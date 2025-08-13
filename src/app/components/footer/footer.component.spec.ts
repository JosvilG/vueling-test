import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  it("debería renderizar 4 links por defecto con routerLink correctos", () => {
    const routerLinks = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    expect(routerLinks.length).toBe(4);

    const dirs = routerLinks.map((de) => de.injector.get(RouterLinkWithHref));
    const hrefs = dirs.map((d) => d.href); // p. ej. '/link1', '/link2', ...
    expect(hrefs).toEqual(["/link1", "/link2", "/link3", "/link4"]);

    const anchors = fixture.debugElement.queryAll(By.css("a"));
    const labels = anchors.map((a) =>
      (a.nativeElement as HTMLAnchorElement).textContent?.trim()
    );
    expect(labels).toEqual(["Link 1", "Link 2", "Link 3", "Link 4"]);
  });

  it("debería aceptar links externos (href/target) y renderizarlos con atributos", () => {
    component.links = [
      {
        label: "Vueling",
        href: "https://www.vueling.com",
        target: "_blank",
      } as any,
    ];
    fixture.detectChanges();

    const a = fixture.debugElement.query(
      By.css('a[href="https://www.vueling.com"]')
    );
    expect(a).toBeTruthy();

    const el = a.nativeElement as HTMLAnchorElement;
    expect(el.getAttribute("target")).toBe("_blank");
    expect(el.getAttribute("rel")).toContain("noopener");

    const routerLinks = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    expect(routerLinks.length).toBe(0);
  });

  it("debería soportar mezcla de internos y externos", () => {
    component.links = [
      { label: "Home", routerLink: "/airportsList" } as any,
      { label: "Docs", href: "https://angular.dev" } as any,
    ];
    fixture.detectChanges();

    const routerLinks = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );
    expect(routerLinks.length).toBe(1);
    const dir = routerLinks[0].injector.get(RouterLinkWithHref);
    expect(dir.href).toBe("/airportsList");

    const external = fixture.debugElement.query(
      By.css('a[href="https://angular.dev"]')
    );
    expect(external).toBeTruthy();

    const labels = fixture.debugElement
      .queryAll(By.css("a"))
      .map((a) => a.nativeElement.textContent.trim());
    expect(labels).toEqual(["Home", "Docs"]);
  });
});
