import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let service: AuthGuard;

  beforeEach(() => {
    const routerStub = () => ({ createUrlTree: (array, object) => ({}) });
    const authServiceStub = () => ({ isLoggedIn: () => ({}) });
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useFactory: routerStub },
        { provide: AuthService, useFactory: authServiceStub }
      ]
    });
    service = TestBed.inject(AuthGuard);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('canActivate', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.inject(Router);
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const authServiceStub: AuthService = TestBed.inject(AuthService);
      spyOn(routerStub, 'createUrlTree').and.callThrough();
      spyOn(authServiceStub, 'isLoggedIn').and.callThrough();
      service.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(routerStub.createUrlTree).toHaveBeenCalled();
      expect(authServiceStub.isLoggedIn).toHaveBeenCalled();
    });
  });
});
