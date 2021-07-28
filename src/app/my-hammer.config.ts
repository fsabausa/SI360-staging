import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from '@angular/platform-browser';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      // override hammerjs default configuration

      'pinch': { enable: false },
      'rotate': { enable: false },
      'pan': { direction: Hammer.DIRECTION_ALL  },
      'press': { direction: Hammer.DIRECTION_ALL  }
  }
}