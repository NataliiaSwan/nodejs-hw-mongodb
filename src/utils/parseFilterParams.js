export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseBoolean(isFavourite);
  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isTypes = (type) => ['name', 'email', 'phoneNumber'].includes(type);

  if (isTypes(type)) return type;
};

const parseBoolean = (value) => {
  if (value === undefined || value === null) return;

  const lowerCaseValue = value.toLowerCase().trim();
  if (lowerCaseValue === 'true') {
    return true;
  } else if (lowerCaseValue === 'false') {
    return false;
  }
};
