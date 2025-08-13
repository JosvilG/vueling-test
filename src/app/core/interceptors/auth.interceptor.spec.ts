import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let service: AuthInterceptor;

  beforeEach(() => {
    const authServiceStub = () => ({ getSecurityKey: () => ({}) });
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useFactory: authServiceStub }
      ]
    });
    service = TestBed.inject(AuthInterceptor);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('makes expected calls', () => {
      const httpRequestStub: HttpRequest = <any>{};
      const httpHandlerStub: HttpHandler = <any>{};
      const authServiceStub: AuthService = TestBed.inject(AuthService);
      spyOn(httpRequestStub, 'clone').and.callThrough();
      spyOn(httpHandlerStub, 'handle').and.callThrough();
      spyOn(authServiceStub, 'getSecurityKey').and.callThrough();
      service.intercept(httpRequestStub, httpHandlerStub);
      expect(httpRequestStub.clone).toHaveBeenCalled();
      expect(httpHandlerStub.handle).toHaveBeenCalled();
      expect(authServiceStub.getSecurityKey).toHaveBeenCalled();
    });
  });
});
