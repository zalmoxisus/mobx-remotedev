export function isFiltered(action, filter) {
  if (!filter) return false;

  const { whitelist, blacklist } = filter;
  return (
    whitelist && !action.type.match(whitelist) ||
    blacklist && action.type.match(blacklist)
  );
}
