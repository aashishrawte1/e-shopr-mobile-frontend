import { createAnimation } from '@ionic/core';

export function modalLeaveAnimation(): any {
  const baseAnimation = createAnimation('modalLeave_base')
    .easing('cubic-bezier(.36, .66, .1, 1)')
    .duration(600)
    .beforeAddClass('show-modal');

  return baseAnimation;
}
