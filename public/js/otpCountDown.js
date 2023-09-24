function countdown(seconds) {
    if (seconds < 0) {
      document.getElementById("countdown").textContent = "Countdown complete!";
      return;
    }
    
    document.getElementById("countdown").textContent = seconds;
    setTimeout(() => countdown(seconds - 1), 1000);
}

  // Start the countdown from 10 seconds
countdown(10);

const el = document.getElementById('test')
el.style.color = 'red'