$(document).ready(function(){
    $(window).scroll(function(){
        // sticky navbar on scroll script
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        
        // scroll-up button show/hide script
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // slide-up script
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        // removing smooth scroll on slide-up button click
        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function(){
        // applying again smooth scroll on menu items click
        $('html').css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

});

// Dark Mode toggle
const toggle = document.getElementById('toggle');
const body = document.body;
const logo = document.getElementById('myLogo');


toggle.addEventListener('input', e => {
    const isChecked = e.target.checked;

    if (isChecked) {
        body.classList.add('dark-theme');

    } else {
        body.classList.remove('dark-theme');

    }
});

  const terminal = document.getElementById("terminal");
  const input = document.getElementById("terminal-input");

  const responses = {
    "help": "Available commands: hello, cd, whoiam, help, clear, lofi, tech, mv, tea, ls, ln, draw, find, cat",
    "whoiam": "My name is Tierra Doughty! Hope you are doing well! Thank you for visiting my portfolio!",
    "draw": "Check out my art gallery page where I post my art projects!",
    "tech": "Loading tech.html...(just kidding, scroll down to see my projects :P)",
    "tea": "Brewing virtual mint tea...refreshing",
    "clear": "clear",
    "lofi": "Lofi music and my laptop...developer vibes are immaculate",
    "hello": "Hey there!",
    "cd": "Silly...I can't play music here",
    "ln": "e???",
    "find": "Finding Waldo...",
    "mv": "Use the navbar to move around",
    "ls": "No files were found, but I found a cookie",
    "cat": "  ^   ^ \n {`o . o}\n  |    \\ \n|\\|  | |\n\\_| m|m/"
  };

  function appendOutput(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

 function showPrompt() {
  // Remove old cursor if it exists
  const oldCursor = document.querySelector(".cursor");
  if (oldCursor) oldCursor.remove();

  // Add new prompt line
  const promptLine = document.createElement("div");
  promptLine.className = "prompt-line";
  promptLine.innerHTML = `user@portfolio:~$ <span id="typed"></span><span class="cursor">█</span>`;
  terminal.appendChild(promptLine);
  terminal.scrollTop = terminal.scrollHeight; // auto-scroll to bottom
}


  function handleCommand(command) {
    if (command === "clear") {
      terminal.innerHTML = "";
      return;
    }
    const output = responses[command] || `command not found: ${command}`;
    appendOutput(output);
  }

  let currentCommand = "";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      appendOutput(`user@portfolio:~$ ${currentCommand}`);
      handleCommand(currentCommand);
      currentCommand = "";
      showPrompt();
    } else if (e.key === "Backspace") {
      currentCommand = currentCommand.slice(0, -1);
    } else if (e.key.length === 1) {
      currentCommand += e.key;
    }

    const typed = document.getElementById("typed");
    if (typed) typed.textContent = currentCommand;
  });

  // Focus the hidden input and show first prompt
  window.addEventListener("DOMContentLoaded", () => {
    input.focus();
    showPrompt();
  });

  // Refocus if user clicks away
  document.addEventListener("click", () => input.focus());




 

  
