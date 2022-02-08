import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SkillsComponent } from './skills/skills.component';
import { SkillSetSharingService } from './SkillSetSharingService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TalismanComponent } from './talisman/talisman.component'
import { MatTabsModule } from '@angular/material/tabs'
import { NgSelectModule } from '@ng-select/ng-select'

@NgModule({
  declarations: [
    AppComponent,
    SkillsComponent,
    TalismanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTabsModule,
    NgSelectModule
  ],
  providers: [SkillSetSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
