const { twMerge } = require("tailwind-merge");
const { clsx } = require("clsx");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const errors = { identifier: "Error" };
const className = `pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl transition-all ${errors.identifier ? 'border-red-400 focus-visible:ring-red-400' : ''}`;

const inputDefaultClass = "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

console.log(cn(inputDefaultClass, className));
