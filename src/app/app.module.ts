import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftNavComponent } from './common/left-nav/left-nav.component';
import { HeaderComponent } from './common/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { UserRequestComponent } from './user-request/user-request.component';
import { TestComponent } from './test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { FirstTimeUserComponent } from './first-time-user/first-time-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserRequestDetailComponent } from './user-request-detail/user-request-detail.component';
import { HistoryComponent } from './history/history.component';
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateComponent } from './create/create.component';
import { CarouselComponent } from './carousel/carousel.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftNavComponent,
    LayoutComponent,
    HomepageComponent,
    UserRequestComponent,
    TestComponent,
    FirstTimeUserComponent,
    UserRequestDetailComponent,
    HistoryComponent,
    CreateComponent,
    CarouselComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    // DatePipe,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
    MatCardModule
],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
