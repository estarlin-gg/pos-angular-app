import { Injectable, signal } from '@angular/core';

const SIDEBAR_STORAGE_KEY = 'pos.layout.sidebarCollapsed';
const DESKTOP_QUERY = '(min-width: 992px)';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly sidebarCollapsed = signal(this.readCollapsedState());
  readonly mobileSidebarOpen = signal(false);

  toggleSidebar(): void {
    if (this.isDesktop()) {
      this.setSidebarCollapsed(!this.sidebarCollapsed());
      return;
    }

    this.mobileSidebarOpen.update((open) => !open);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  private isDesktop(): boolean {
    return typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches;
  }

  private setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);

    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
    } catch {
      // Storage may be unavailable (private mode); the layout still works.
    }
  }

  private readCollapsedState(): boolean {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
