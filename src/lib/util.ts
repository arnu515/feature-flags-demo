import { twMerge } from "tailwind-merge";
import classNames, { ArgumentArray } from "classnames";

export const cn = (...args: ArgumentArray) => twMerge(classNames(args));

export function getRelativeDateString(date: Date): string {
  const now = new Date();
  const rtf = new Intl.RelativeTimeFormat();
  if (now.getDate() == date.getDate()) {
    // format with time
    if (now.getHours() == date.getHours())
      if (now.getMinutes() == date.getMinutes())
        return rtf.format(date.getSeconds() - now.getSeconds(), "seconds");
      else return rtf.format(date.getMinutes() - now.getMinutes(), "minutes");
    else return rtf.format(date.getHours() - now.getHours(), "hours");
  } else return "on " + new Intl.DateTimeFormat().format(date);
}
