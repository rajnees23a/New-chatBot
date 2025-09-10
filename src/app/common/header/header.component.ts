import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { APP_CONSTANTS } from '../../constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  readonly headerText = APP_CONSTANTS.HEADER;
  appTitle = this.headerText.APP_TITLE;
  notificationTooltip = this.headerText.NOTIFICATION_TOOLTIP;
  myAccountTooltip = this.headerText.MY_ACCOUNT_TOOLTIP;
  userInitials = this.headerText.USER_INITIALS;

}
