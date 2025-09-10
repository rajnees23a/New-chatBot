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
  appTitle = APP_CONSTANTS.APP_TITLE;
  notificationTooltip = APP_CONSTANTS.NOTIFICATION_TOOLTIP;
  myAccountTooltip = APP_CONSTANTS.MY_ACCOUNT_TOOLTIP;
  userInitials = APP_CONSTANTS.USER_INITIALS;

}
