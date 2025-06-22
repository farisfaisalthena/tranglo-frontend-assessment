import {
  ChangeDetectorRef,
  inject,
  NgZone,
  OnDestroy,
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {

  private changeDetectorRef = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  private timer: ReturnType<typeof setTimeout> | null = null;

  transform(value: Date): string {
    this.clearTimer();

    const then = new Date(value).getTime();
    const now = Date.now();
    const sec = Math.floor((now - then) / 1000);

    // schedule the next update at the appropriate boundary
    const t = this.secondsUntilNext(sec);
    if (t > 0) {
      this.ngZone.runOutsideAngular(() => {
        this.timer = setTimeout(() =>
          this.ngZone.run(() => this.changeDetectorRef.markForCheck())
          , t * 30000);
      });
    };

    if (sec < 30) {
      return 'Just now';
    };

    if (sec < 60) {
      return `${sec} second${sec > 1 ? 's' : ''} ago`;
    };

    if (sec < 3600) {
      const m = Math.floor(sec / 60);
      return `${m} minute${m > 1 ? 's' : ''} ago`;
    };

    if (sec < 86400) {
      const h = Math.floor(sec / 3600);
      return `${h} hour${h > 1 ? 's' : ''} ago`;
    };

    const d = Math.floor(sec / 86400);

    return `${d} day${d > 1 ? 's' : ''} ago`;
  };

  ngOnDestroy(): void {
    this.clearTimer();
  };

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    };
  };

  /**
   * Given elapsed seconds, return how many seconds until we need
   * to refresh again (at the next second, minute, hour or day boundary).
   */
  private secondsUntilNext(elapsed: number): number {
    if (elapsed < 60) {
      // update every second
      return 1;
    };

    if (elapsed < 3600) {
      // update at next minute
      return 60 - (elapsed % 60);
    };

    if (elapsed < 86400) {
      // update at next hour
      return 3600 - (elapsed % 3600);
    };

    // update at next day
    return 86400 - (elapsed % 86400);
  };
};
