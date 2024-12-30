import {
  AnyComponent,
  // createElement,
  // FunctionalComponent,
  // RenderableProps,
  ComponentChild,
  ComponentChildren,
} from 'preact'
import { ButtonHTMLAttributes, forwardRef, ElementRef } from '@types/react'

export {
  Attributes,
  FunctionalComponent as SFC,
  AnyComponent as ComponentType,
  AnyComponent as JSXElementConstructor,
  Component as ComponentClass,
  ClassAttributes,
  PreactContext as Context,
  PreactProvider as Provider,
  ButtonHTMLAttributes,
  forwardRef,
  ElementRef,
  ComponentPropsWithoutRef,
  VNode as ReactElement,
  createElement,
  Fragment,
  Ref,
  render,
  JSX,
  RenderableProps as ComponentPropsWithRef,
} from 'preact'

export type ReactNode = ComponentChild | ComponentChildren

export type JSXElementConstructor = AnyComponent
