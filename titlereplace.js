const original = "I have been wondering about gates, ever since my I left mine open last wednesday";
const replacement = "<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3";

setInterval(() => {
  if (document.title === original) {
    document.title = replacement;
  } else {
    document.title = original;
  }
}, 500);
