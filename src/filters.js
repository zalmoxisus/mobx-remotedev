export function isFiltered(action, localFilter) {
  if (
    !localFilter && !window.devToolsOptions ||
    !window.devToolsOptions.filter || window.devToolsOptions.filter === 'DO_NOT_FILTER'
  ) return false;

  const { whitelist, blacklist } = localFilter || window.devToolsOptions;
  return (
    whitelist && !action.type.match(whitelist) ||
    blacklist && action.type.match(blacklist)
  );
}
