import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UserRequestComponent } from './user-request/user-request.component';
import { TestComponent } from './test/test.component';
import { UserRequestDetailComponent } from './user-request-detail/user-request-detail.component';
import { HistoryComponent } from './history/history.component';
import { CreateComponent } from './create/create.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,

    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomepageComponent },
      { path: 'request', component: UserRequestComponent },
      { path: 'requestDetail/:id', component: UserRequestDetailComponent },
      { path: 'trial', component: TestComponent },
      { path: 'create', component: TestComponent }, // Use TestComponent for create mode
      { path: 'bic', component: TestComponent }, // Use TestComponent for draft mode
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
