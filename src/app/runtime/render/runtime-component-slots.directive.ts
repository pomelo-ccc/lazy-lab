import { Directive, TemplateRef, inject } from '@angular/core';

import { ComponentId } from '../type/component-id';

export interface ComponentLoadingTemplateContext {
  readonly $implicit: ComponentId;
  readonly is: ComponentId;
  readonly source: string;
}

export interface ComponentErrorTemplateContext extends ComponentLoadingTemplateContext {
  readonly error: string;
}

@Directive({
  selector: 'ng-template[componentLoading]'
})
export class ComponentLoadingDirective {
  readonly templateRef = inject(TemplateRef<ComponentLoadingTemplateContext>);
}

@Directive({
  selector: 'ng-template[componentError]'
})
export class ComponentErrorDirective {
  readonly templateRef = inject(TemplateRef<ComponentErrorTemplateContext>);
}

@Directive({
  selector: 'ng-template[componentEmpty]'
})
export class ComponentEmptyDirective {
  readonly templateRef = inject(TemplateRef<ComponentLoadingTemplateContext>);
}
