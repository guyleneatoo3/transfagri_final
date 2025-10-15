import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarHorizontalComponent } from './navbar-horizontal.component';
import { NavbarVerticalComponent } from './navbar-vertical.component';

@NgModule({
  imports: [CommonModule, NavbarHorizontalComponent, NavbarVerticalComponent],
  exports: [NavbarHorizontalComponent, NavbarVerticalComponent]
})
export class SharedModule {}
