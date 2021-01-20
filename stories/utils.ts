export const extractArgs = <A extends object>(args: A, other: A): A =>
  Object.entries(args).reduce(
    (acc, [key, val]) => {
      if (Array.isArray(val) && val.every(v => v === undefined)) {
        return acc;
      }
      if (val === undefined) {
        return acc;
      }
      return { ...acc, [key]: val };
    },
    { ...other },
  );
