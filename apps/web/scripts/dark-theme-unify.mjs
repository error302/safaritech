import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");
const skip = /[\\/]admin[\\/]/;

const replacements = [
  [/md:bg-safaridark bg-gray-50/g, "bg-safaridark"],
  [/bg-white md:bg-safarigray/g, "bg-safarigray"],
  [/bg-white md:bg-safaridark/g, "bg-safaridark"],
  [/border-gray-200 md:border-safariborder/g, "border-safariborder"],
  [/border-gray-100 md:border-safariborder/g, "border-safariborder"],
  [/text-gray-900 md:text-white/g, "text-white"],
  [/md:text-white text-gray-900/g, "text-white"],
  [/text-gray-600 md:text-gray-300/g, "text-gray-300"],
  [/text-gray-600 md:text-gray-400/g, "text-gray-400"],
  [/bg-gray-50 md:bg-safaridark/g, "bg-safaridark"],
  [/bg-gray-50 md:bg-safarigray/g, "bg-safarigray"],
  [/bg-gray-100 md:bg-safarigray/g, "bg-safarigray"],
  [/bg-gray-200 md:bg-safarigray/g, "bg-safarigray"],
  [/hover:bg-gray-50 md:hover:bg-safaridark/g, "hover:bg-safaridark"],
  [/bg-gray-100 md:bg-safarigray text-gray-600 md:text-gray-300 hover:bg-gray-200 md:hover:bg-safariborder/g, "bg-safarigray text-gray-300 hover:bg-safariborder"],
  [/bg-gray-900 md:bg-white text-white md:text-black/g, "bg-white text-black"],
  [/bg-white md:bg-safarigray\/20/g, "bg-safarigray/20"],
  [/flex min-h-\[calc\(100vh-4rem\)\] items-center justify-center py-8 md:py-12 px-4 bg-white md:bg-safaridark/g, "flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 md:py-12 px-4 bg-safaridark"],
  [/flex min-h-\[calc\(100vh-4rem\)\] items-center justify-center bg-white py-8 px-4 md:bg-safaridark md:py-12/g, "flex min-h-[calc(100vh-4rem)] items-center justify-center bg-safaridark py-8 px-4 md:py-12"],
  [/rounded-lg border border-gray-200 bg-white p-6 md:rounded-xl md:border-safariborder md:bg-safarigray md:p-8/g, "rounded-xl border border-safariborder bg-safarigray p-6 md:p-8"],
  [/border border-gray-200 bg-gray-50 px-4 py-2\.5 text-gray-900 placeholder:text-gray-400 focus:border-neon focus:outline-none md:border-safariborder md:bg-safarigray md:text-white md:placeholder:text-gray-500 md:focus:border-electric/g, "border border-safariborder bg-safarigray px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-neon focus:outline-none"],
  [/md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white\/95 backdrop-blur-lg border-t border-gray-100/g, "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-safaridark/95 backdrop-blur-lg border-t border-safariborder"],
  [/bg-white md:bg-safaridark border border-gray-100 md:border-safariborder/g, "bg-safaridark border border-safariborder"],
  [/w-full pl-9 pr-4 py-2\.5 rounded-xl border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safarigray text-sm text-gray-900 md:text-white/g, "w-full pl-9 pr-4 py-2.5 rounded-xl border border-safariborder bg-safarigray text-sm text-white"],
  [/bg-gray-100 md:bg-safarigray hover:bg-red-50 md:hover:bg-red-900\/20 hover:text-red-600 md:hover:text-red-400 text-gray-900 md:text-white/g, "bg-safarigray hover:bg-red-900/20 hover:text-red-400 text-white"],
  [/hover:border-red-200 md:hover:border-red-900/g, "hover:border-red-900"],
  [/aspect-\[3\/4\] rounded-2xl bg-gray-100 md:bg-safarigray/g, "aspect-[3/4] rounded-2xl bg-safarigray"],
  [/text-center py-20 bg-white md:bg-safarigray\/20 border border-gray-100 md:border-safariborder/g, "text-center py-20 bg-safarigray/20 border border-safariborder"],
  [/w-20 h-20 bg-gray-50 md:bg-safaridark/g, "w-20 h-20 bg-safaridark"],
  [/font-display font-bold text-xl md:text-2xl text-gray-900 md:text-white/g, "font-display font-bold text-xl md:text-2xl text-white"],
  [/min-h-screen bg-white md:bg-safaridark/g, "min-h-screen bg-safaridark"],
];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".tsx") && !skip.test(p)) {
      let text = fs.readFileSync(p, "utf8");
      const before = text;
      for (const [re, rep] of replacements) text = text.replace(re, rep);
      if (text !== before) {
        fs.writeFileSync(p, text);
        console.log("updated:", path.relative(root, p));
      }
    }
  }
}

walk(root);
console.log("done");
