import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface AuthState {
  username: string | null;
  securityKey: string | null;
}

const K_USER = "auth.username";
const K_KEY = "auth.securityKey";

@Injectable({ providedIn: "root" })
export class AuthService {
  private _state$ = new BehaviorSubject<AuthState>({
    username: sessionStorage.getItem(K_USER),
    securityKey: sessionStorage.getItem(K_KEY),
  });

  readonly state$ = this._state$.asObservable();
  get state() {
    return this._state$.value;
  }

  getUsername() {
    return this.state.username;
  }
  getSecurityKey() {
    return this.state.securityKey;
  }
  isLoggedIn() {
    return !!this.state.securityKey;
  }

  login(username: string, securityKey: string) {
    sessionStorage.setItem(K_USER, username);
    sessionStorage.setItem(K_KEY, securityKey);
    this._state$.next({ username, securityKey });
  }

  logout() {
    sessionStorage.removeItem(K_USER);
    sessionStorage.removeItem(K_KEY);
    this._state$.next({ username: null, securityKey: null });
  }
}
