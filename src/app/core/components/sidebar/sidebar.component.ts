import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideLayoutDashboard,
  LucideLogOut,
  LucidePackage,
  LucideSettings,
  LucideShoppingCart,
  LucideStore,
  LucideTable,
  LucideUserRound,
  LucideUsers,
  LucideX,
} from '@lucide/angular';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideLayoutDashboard,
    LucideLogOut,
    LucidePackage,
    LucideSettings,
    LucideShoppingCart,
    LucideStore,
    LucideUserRound,
    LucideUsers,
    LucideX,
    LucideTable
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  host: {
    '[class.is-collapsed]': 'layout.sidebarCollapsed()',
    '[class.is-open]': 'layout.mobileSidebarOpen()',
  },
})
export class SidebarComponent {
  protected readonly layout = inject(LayoutService);
}
