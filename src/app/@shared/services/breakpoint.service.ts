import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { BreakpointFlags } from '../interfaces/breakpoint-flags';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  };
  private breakpointFlags: BreakpointFlags = {
    xs: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
    sm: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
    md: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
    lg: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
    xl: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
    xxl: {
      lessThen: false,
      between: false,
      gatherThen: false,
    },
  };
  public screen = new BehaviorSubject<BreakpointFlags>(this.breakpointFlags);

  constructor() {
    this.setBreakpoints(window.innerWidth);

    fromEvent(window, 'resize').pipe(debounceTime(300), map(() => window.innerWidth), distinctUntilChanged()).subscribe((innerWidth) => {
      this.setBreakpoints(innerWidth);
    });
  }

  private setBreakpoints(innerWidth: number) {
    this.breakpointFlags.xs.lessThen = innerWidth <= this.breakpoints.xs;
    this.breakpointFlags.xs.between = innerWidth >= this.breakpoints.xs && innerWidth <= this.breakpoints.sm;
    this.breakpointFlags.xs.gatherThen = innerWidth >= this.breakpoints.xs;

    this.breakpointFlags.sm.lessThen = innerWidth <= this.breakpoints.sm;
    this.breakpointFlags.sm.between = innerWidth >= this.breakpoints.sm && innerWidth <= this.breakpoints.md;
    this.breakpointFlags.sm.gatherThen = innerWidth >= this.breakpoints.sm;

    this.breakpointFlags.md.lessThen = innerWidth <= this.breakpoints.md;
    this.breakpointFlags.md.between = innerWidth >= this.breakpoints.md && innerWidth <= this.breakpoints.lg;
    this.breakpointFlags.md.gatherThen = innerWidth >= this.breakpoints.md;

    this.breakpointFlags.lg.lessThen = innerWidth <= this.breakpoints.lg;
    this.breakpointFlags.lg.between = innerWidth >= this.breakpoints.lg && innerWidth <= this.breakpoints.xl;
    this.breakpointFlags.lg.gatherThen = innerWidth >= this.breakpoints.lg;

    this.breakpointFlags.xl.lessThen = innerWidth <= this.breakpoints.xl;
    this.breakpointFlags.xl.between = innerWidth >= this.breakpoints.xl && innerWidth <= this.breakpoints.xxl;
    this.breakpointFlags.xl.gatherThen = innerWidth >= this.breakpoints.xl;

    this.breakpointFlags.xxl.lessThen = innerWidth <= this.breakpoints.xxl;
    this.breakpointFlags.xxl.between = innerWidth >= this.breakpoints.xxl;
    this.breakpointFlags.xxl.gatherThen = innerWidth >= this.breakpoints.xxl;

    this.screen.next(this.breakpointFlags);
  }
}
