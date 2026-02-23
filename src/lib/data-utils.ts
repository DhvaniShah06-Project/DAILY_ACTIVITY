/**
 * Removes properties with `undefined` values from an object.
 * This is useful for cleaning data before sending it to Firestore,
 * which does not allow `undefined` field values.
 * @param obj The object to clean.
 * @returns A new object with `undefined` properties removed.
 */
export function removeUndefinedFields<T extends object>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const newObj = { ...obj };
  for (const key in newObj) {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  }
  return newObj;
}
