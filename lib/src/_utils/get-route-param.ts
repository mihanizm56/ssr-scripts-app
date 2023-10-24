import { State } from 'router5';

type ParamsType<ValueType> = {
  route: State;
  defaultValue: ValueType;
  paramName: string;
  formatter?: (param: any) => ValueType;
};

export const getRouteParam = <ValueType>({
  route,
  paramName,
  defaultValue,
  formatter,
}: ParamsType<ValueType>): ValueType => {
  const routeParams = route.params;

  if (!routeParams || !routeParams[paramName]) {
    return defaultValue;
  }

  return formatter ? formatter(routeParams[paramName]) : routeParams[paramName];
};
