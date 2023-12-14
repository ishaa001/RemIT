// Select The Elements
var toggle_btn;
var big_wrapper;
var hamburger_menu;

function declare() {
  toggle_btn = document.querySelector(".toggle-btn");
  big_wrapper = document.querySelector(".big-wrapper");
  hamburger_menu = document.querySelector(".hamburger-menu");
}

const main = document.querySelector("main");

declare();

let dark = false;

function toggleAnimation() {
  // Clone the wrapper
  dark = !dark;
  let clone = big_wrapper.cloneNode(true);
  if (dark) {
    clone.classList.remove("light");
    clone.classList.add("dark");
  } else {
    clone.classList.remove("dark");
    clone.classList.add("light");
  }
  clone.classList.add("copy");
  main.appendChild(clone);

  document.body.classList.add("stop-scrolling");

  clone.addEventListener("animationend", () => {
    document.body.classList.remove("stop-scrolling");
    big_wrapper.remove();
    clone.classList.remove("copy");
    // Reset Variables
    declare();
    events();
  });
}

function events() {
  toggle_btn.addEventListener("click", toggleAnimation);
  hamburger_menu.addEventListener("click", () => {
    big_wrapper.classList.toggle("active");
  });
}

events();


/*Random Quote Generator*/

const text = document.querySelector('.quote')
const author = document.querySelector('.author')
const nextBtn =  document.querySelector('.next')

const getQuote = async () => 
{
  const res = await fetch('https://type.fit/api/quotes');
  const quotes = await res.json()
  //   console.log(quotes)
  const num = Math.floor(Math.random() * quotes.length)
  // console.log(num)
  const item = quotes[num];
  // console.log(item , num)
  const quote = item.text
  const authorName = item.author
  text.innerText = quote
  author.innerText = authorName
}

nextBtn.addEventListener("click" , getQuote)
getQuote()