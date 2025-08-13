import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AirportCardComponent } from "./airport-card.component";

describe("AirportCardComponent", () => {
  let component: AirportCardComponent;
  let fixture: ComponentFixture<AirportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AirportCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirportCardComponent);
    component = fixture.componentInstance;

    component.name = "Barcelona–El Prat";
    component.code = "BCN";
    component.city = "Barcelona";
    component.country = "Spain";

    fixture.detectChanges();
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  it("debería renderizar name, code, city y country en el template", () => {
    const el: HTMLElement = fixture.nativeElement;
    const text = el.textContent || "";
    expect(text).toContain("Barcelona–El Prat");
    expect(text).toContain("BCN");
    expect(text).toContain("Barcelona");
    expect(text).toContain("Spain");
  });

  it("debería emitir select con el code al hacer click", () => {
    const spy = spyOn(component.select, "emit");
    component.onClick();
    expect(spy).toHaveBeenCalledWith("BCN");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("debería emitir select con Enter y prevenir el comportamiento por defecto", () => {
    const spy = spyOn(component.select, "emit");
    const prevent = jasmine.createSpy("preventDefault");

    component.onKeydown({ key: "Enter", preventDefault: prevent } as any);

    expect(prevent).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith("BCN");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("debería emitir select con Space y prevenir el comportamiento por defecto", () => {
    const spy = spyOn(component.select, "emit");
    const prevent = jasmine.createSpy("preventDefault");

    component.onKeydown({ key: " ", preventDefault: prevent } as any);

    expect(prevent).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith("BCN");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("NO debería emitir con otra tecla (p.ej. Escape)", () => {
    const spy = spyOn(component.select, "emit");
    const prevent = jasmine.createSpy("preventDefault");

    component.onKeydown({ key: "Escape", preventDefault: prevent } as any);

    expect(prevent).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});
