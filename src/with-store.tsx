import React from "react";
import type {
  ClassAttributes,
  ComponentClass,
  ComponentType,
  FC,
  NamedExoticComponent,
} from "react";

import type { NonReactStatics } from "hoist-non-react-statics";

type Deps<T> = (store: T) => unknown[];
type UseStore<T> = {
  (depsFn?: Deps<T>): T;
  store?: T;
};

// Infers prop type from component C
export type GetProps<C> = C extends ComponentType<infer P>
  ? C extends ComponentClass<P>
    ? ClassAttributes<InstanceType<C>> & P
    : P
  : never;

export type ConnectedComponent<
  C extends ComponentType<any>,
  P
> = NamedExoticComponent<JSX.LibraryManagedAttributes<C, P>> &
  NonReactStatics<C> & {
    WrappedComponent: C;
  };

export type Matching<InjectedProps, DecorationTargetProps> = {
  [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
    ? InjectedProps[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : InjectedProps[P]
    : DecorationTargetProps[P];
};

export type Shared<InjectedProps, DecorationTargetProps> = {
  [P in Extract<
    keyof InjectedProps,
    keyof DecorationTargetProps
  >]?: InjectedProps[P] extends DecorationTargetProps[P]
    ? DecorationTargetProps[P]
    : never;
};

export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

export type GetLibraryManagedProps<C> = JSX.LibraryManagedAttributes<
  C,
  GetProps<C>
>;

type Identity<T> = T;
export type Mapped<T> = Identity<{ [k in keyof T]: T[k] }>;

export type InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> = <
  C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
>(
  component: C
) => ConnectedComponent<
  C,
  Mapped<
    DistributiveOmit<
      GetLibraryManagedProps<C>,
      keyof Shared<TInjectedProps, GetLibraryManagedProps<C>>
    > &
      TNeedsProps
  >
>;

type MapModelToProps<TStoreProps, TOwnProps, Store> = (
  store: Store,
  ownProps: TOwnProps
) => TStoreProps;

export function withStore<TStoreProps, TOwnProps, T>(
  useStore: UseStore<T>,
  mapModelToProps: MapModelToProps<TStoreProps, TOwnProps, T>
): InferableComponentEnhancerWithProps<TStoreProps, TOwnProps>;
export function withStore<TStoreProps, TOwnProps, Model>(
  useStores: UseStore<any>[],
  mapModelToProps: MapModelToProps<TStoreProps, TOwnProps, any[]>
): InferableComponentEnhancerWithProps<TStoreProps, TOwnProps>;
export function withStore<TStoreProps, TOwnProps, T>(
  useStoreOrUseStores: UseStore<any> | UseStore<any>[],
  mapStoreToProps: MapModelToProps<TStoreProps, TOwnProps, any>
) {
  return function (C) {
    const Wrapper: FC<any> = function (props) {
      let modelProps;
      if (Array.isArray(useStoreOrUseStores)) {
        const stores = [];
        for (const useStore of useStoreOrUseStores) {
          stores.push(useStore());
        }
        modelProps = mapStoreToProps(stores, props);
      } else {
        const store = useStoreOrUseStores();
        modelProps = mapStoreToProps(store, props);
      }
      const componentProps = {
        ...props,
        ...modelProps,
      };
      return <C {...componentProps} />;
    };
    Wrapper.displayName = `${C.displayName}Wrapper`;
    return Wrapper;
  };
}
