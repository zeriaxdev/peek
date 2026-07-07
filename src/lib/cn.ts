export const cn = (...c: Array<string | false | undefined>) =>
  c.filter(Boolean).join(" ");
