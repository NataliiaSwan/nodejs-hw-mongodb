const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
  return undefined;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavorite } = query;

  const parsedContactType = parseContactType(type);
  const parsedIsFavorite = parseBoolean(isFavorite);

  return {
    type: parsedContactType,
    isFavorite: parsedIsFavorite,
  };
};
