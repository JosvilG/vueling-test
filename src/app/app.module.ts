import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { AirportCardComponent } from "./components/airport-card/airport-card.component";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";
import { AirportsListComponent } from "./pages/airports-list/airports-list.component";
import { AirportDetailComponent } from "./pages/airports-details/airports-details.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { LoginComponent } from "./pages/login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { LoaderComponent } from "./components/loader/loader.component";
import { ErrorPageComponent } from "./pages/error/error.component";
import { ButtonComponent } from "./components/buttons/buttons.component";
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SideMenuComponent,
    AirportCardComponent,
    AirportsListComponent,
    AirportDetailComponent,
    LoginComponent,
    LoaderComponent,
    ErrorPageComponent,
    ButtonComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppRoutingModule,
  ],
  exports: [MatIconModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
