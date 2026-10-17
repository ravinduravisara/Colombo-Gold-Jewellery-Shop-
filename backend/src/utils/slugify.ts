import slugifyOriginal from "slugify";

export const generateSlug = (text: string): string => {
  return slugifyOriginal(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

