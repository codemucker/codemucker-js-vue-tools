/**
 * Instead of relying on magically named methods we get wrong and forget, let's use a type
 * to enforce the naming. These names match the vue magic method name
 *
 * See https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
 * See https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
 * See https://www.digitalocean.com/community/tutorials/vuejs-component-lifecycle
 */

import { NavigationGuardNext, Route } from 'vue-router';

export module VueComponentLifecycle {
  export interface BeforeCreated {
    /**
     * Invoked before the vue component is created. See https://vuejs.org/v2/api/#beforeCreate
     */
    beforeCreate(): void
  }

  export interface AfterCreated {
    /**
     * Invoked when the vue component is created. See https://vuejs.org/v2/api/#created
     */
    created(): void
  }

  export interface BeforeMount {
    /**
     * Invoked when the the vue component is mounted. See https://vuejs.org/v2/api/#beforeMount
     */
    beforeMount(): void
  }
  export interface AfterMounted {
    /**
     * Invoked when the the vue component is mounted. See https://vuejs.org/v2/api/#mounted
     */
    mounted(): void
  }

  export interface OnRender {
    /**
     * Invoked when the the vue component should render it's content. Implement to return custom html. See https://class-component.vuejs.org/guide/class-component.html#hooks
     */
    render(): string
  }

  export interface BeforeUpdate {
    /**
     * Invoked when data changes but before the DOM is patched (changed). See https://vuejs.org/v2/api/#beforeUpdate
     */
    beforeUpdate(): void
  }

  export interface AfterUpdate {
    /**
     * Invoked when data changes and after the DOM is patched (changed). See https://vuejs.org/v2/api/#updated
     */
    updated(): void
  }
  export interface KeptAliveAactivated {
    /**
     * Invoked when a kept alive component is activated. See https://vuejs.org/v2/api/#activated
     */
    activated(): void
  }

  export interface KeptAliveDeactivated {
    /**
     * Invoked when a  kept alive component is deactivated. See https://vuejs.org/v2/api/#deactivated
     */
    deactivated(): void
  }

  export interface BeforeDestroy {
    /**
     * Invoked before the component is destroyed. See https://vuejs.org/v2/api/#beforeDestroy
     */
    beforeDestroy(): void
  }

  export interface AfterDestroy {
    /**
     * Invoked after the component is destroyed. See https://vuejs.org/v2/api/#destroyed
     */
    destroyed(): void
  }

  export interface ErrorCaptured {
    /**
     * Invoked when an error from any descendent component is captured. See https://vuejs.org/v2/api/#errorCaptured
     */
    errorCaptured(err: unknown, componentInstance: Vue, details: string): void
  }

  // ========= additional hooks provided when using vue-router
  // see https://class-component.vuejs.org/guide/additional-hooks.html

  export interface BeforeRouteEnter {
    /**
     * Invoked before a route is entered. See https://class-component.vuejs.org/guide/additional-hooks.html
     *
     * Be sure to call 'next()
     */
    beforeRouteEnter(to: Route, from: Route, next: NavigationGuardNext): void
  }

  export interface BeforeRouteUpdate {
    /**
     * Invoked before a route is updated. See https://class-component.vuejs.org/guide/additional-hooks.html
     *
     * Be sure to call 'next()
     */
    beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext): void
  }
  export interface BeforeRouteLeave {
    /**
     * Invoked before a route is updated. See https://class-component.vuejs.org/guide/additional-hooks.html
     *
     * Be sure to call 'next()
     */
    beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext): void
  }
}
