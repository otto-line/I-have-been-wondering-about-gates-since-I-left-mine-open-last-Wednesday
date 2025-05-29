const original = "//]|[ <3 <3 <3 ]|[\\";
const replacement = "<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3";

setInterval(() => {
  if (document.title === original) {
    document.title = replacement;
  } else {
    document.title = original;
  }
}, 500);
