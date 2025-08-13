import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ButtonComponent } from "./buttons.component";

describe("ButtonComponent", () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crearse", () => {
    expect(component).toBeTruthy();
  });

  describe("classes", () => {
    it("por defecto: primary + md sin fullWidth", () => {
      const classes = component.classes;
      expect(classes["btn"]).toBeTrue();
      expect(classes["btn--primary"]).toBeTrue();
      expect(classes["btn--md"]).toBeTrue();
      expect(classes["btn--full"]).toBeFalse();
    });

    it("debería reflejar variant/size/fullWidth configurados", () => {
      component.variant = "secondary";
      component.size = "lg";
      component.fullWidth = true;

      const classes = component.classes;
      expect(classes["btn"]).toBeTrue();
      expect(classes["btn--secondary"]).toBeTrue();
      expect(classes["btn--lg"]).toBeTrue();
      expect(classes["btn--full"]).toBeTrue();

      expect(classes["btn--primary"]).toBeFalsy();
      expect(classes["btn--md"]).toBeFalsy();
    });

    it("soporta variant: outline y size: sm", () => {
      component.variant = "outline";
      component.size = "sm";

      const classes = component.classes;
      expect(classes["btn--outline"]).toBeTrue();
      expect(classes["btn--sm"]).toBeTrue();
    });
  });

  describe("rel", () => {
    it("debería ser null cuando target es _self", () => {
      component.target = "_self";
      expect(component.rel).toBeNull();
    });

    it('debería ser "noopener noreferrer" cuando target es _blank', () => {
      component.target = "_blank";
      expect(component.rel).toBe("noopener noreferrer");
    });
  });

  describe("onClick", () => {
    it("debería emitir clicked con el evento cuando no está disabled", () => {
      const spy = spyOn(component.clicked, "emit");
      component.disabled = false;

      const ev = {
        preventDefault: jasmine.createSpy("preventDefault"),
        stopPropagation: jasmine.createSpy("stopPropagation"),
      } as unknown as MouseEvent;

      component.onClick(ev);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(ev);
      expect((ev as any).preventDefault).not.toHaveBeenCalled();
      expect((ev as any).stopPropagation).not.toHaveBeenCalled();
    });

    it("no debería emitir y debe prevenir cuando está disabled", () => {
      const spy = spyOn(component.clicked, "emit");
      component.disabled = true;

      const ev = {
        preventDefault: jasmine.createSpy("preventDefault"),
        stopPropagation: jasmine.createSpy("stopPropagation"),
      } as unknown as MouseEvent;

      component.onClick(ev);

      expect(spy).not.toHaveBeenCalled();
      expect((ev as any).preventDefault).toHaveBeenCalled();
      expect((ev as any).stopPropagation).toHaveBeenCalled();
    });
  });
});
