import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AirportsListComponent } from "./pages/airports-list/airports-list.component";
import { AirportDetailComponent } from "./pages/airports-details/airports-details.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { ErrorPageComponent } from "./pages/error/error.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "airportsList" },
  { path: "login", component: LoginComponent },
  {
    path: "airportsList",
    canActivate: [AuthGuard],
    component: AirportsListComponent,
  },
  {
    path: "airports/:code",
    canActivate: [AuthGuard],
    component: AirportDetailComponent,
  },
  { path: "error", component: ErrorPageComponent },
  { path: "**", component: ErrorPageComponent, data: { code: 404 } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
