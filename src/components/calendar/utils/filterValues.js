export const NONE_FILTER_VALUE = "__none__";

export const toApiFilterValue = (value) =>
  value === NONE_FILTER_VALUE || Array.isArray(value) ? "" : value;
