/**
 * Removes properties with `undefined` values from an object.
 * This is crucial for Firestore, which rejects objects containing `undefined`.
 * @param obj The object to clean.
 * @returns A new object with `undefined` properties removed.
 */
export function cleanData<T extends object>(obj: T): Partial<T> {
  const newObj: { [K in keyof T]?: T[K] } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj as Partial<T>;
}
