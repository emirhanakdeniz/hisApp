let currentParticleColor = "#ffffff";
let lastEmotion = null;
let currentUser = null;
let isFirstAnalysis = false;

const emotionColors = {
  Happy: "#FFD700",
  Sadness: "#6495ED",
  Anger: "#FF4500",
  Fear: "#9370DB",
  Disgust: "#32CD32",
  Surprise: "#FF69B4",
  Neutral: "#10a37f"
};

const emojis = {
  Happy: "😊",
  Sadness: "😢",
  Anger: "😡",
  Fear: "😨",
  Disgust: "🤢",
  Surprise: "😮",
  Neutral: "😐"
};

const emotionTranslations = {
  Happy: "Mutluluk",
  Sadness: "Üzüntü",
  Anger: "Öfke",
  Fear: "Korku",
  Disgust: "Tiksinti",
  Surprise: "Şaşkınlık",
  Neutral: "Nötr"
};

window.addEventListener("load", () => {
  const savedUsers = JSON.parse(localStorage.getItem("users")) || {};
  const savedCurrentUser = localStorage.getItem("currentUser");
  const nameModal = document.getElementById("name-modal");
  
  loadUsers();
  animateBrandLogo();
  
  if (savedCurrentUser && savedUsers[savedCurrentUser]) {
    currentUser = savedCurrentUser;
    updatePlaceholder(currentUser);
    updateGreeting(currentUser);
    updateUserContainer(currentUser);
    if (!savedUsers[savedCurrentUser].hasSeenOnboarding) {
      startOnboarding(currentUser);
    }
    loadHistory();
  } else {
    nameModal.classList.add("show");
    gsap.to(nameModal.querySelector(".modal-content"), {
      duration: 0.3,
      opacity: 1,
      y: 0,
      ease: "power3.out"
    });
  }

  gsap.to(".container", {
    duration: 1,
    opacity: 1,
    y: 0,
    ease: "power3.out",
  });

  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: currentParticleColor },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 120,
        color: currentParticleColor,
        opacity: 0.2,
        width: 1,
      },
      move: { enable: true, speed: 1 }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
  
  updateFavicon("Neutral");
  setupRippleEffect();
  setupDropdown();
});

function animateBrandLogo() {
  const brandLogo = document.getElementById("brand-logo");
  gsap.to(brandLogo, {
    scale: 1.08,
    rotation: 5,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}

function updateFavicon(emotion) {
  const favicon = document.getElementById("favicon");
  const color = emotionColors[emotion] || "#10a37f";
  const gradientId = `heartGradient-${emotion || 'Neutral'}`;
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color === '#10a37f' ? '#0e8e70' : color};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000000" flood-opacity="0.2"/>
        </filter>
      </defs>
      <rect width="32" height="32" fill="transparent"/>
      <path d="M16 28C16 28 7 22 7 14C7 10.5 10 7.5 13 7.5C15 7.5 16.5 8.5 17 10C17.5 8.5 19 7.5 21 7.5C24 7.5 27 10.5 27 14C27 22 16 28 16 28Z"
            fill="url(#${gradientId})"
            stroke="#ececec"
            stroke-width="0.8"
            filter="url(#shadow)">
        <animate attributeName="scale" values="1;1.08;1" dur="1.2s" repeatCount="indefinite"/>
      </path>
    </svg>
  `;
  favicon.href = "data:image/svg+xml;base64," + btoa(svg);
}

function setupDropdown() {
  const dropdownSelected = document.getElementById("dropdown-selected");
  const dropdownMenu = document.getElementById("dropdown-menu");
  
  dropdownSelected.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdownSelected.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
}

function loadUsers() {
  const dropdownMenu = document.getElementById("dropdown-menu");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  dropdownMenu.innerHTML = '<div class="dropdown-item" data-value="new">Yeni Kullanıcı</div>';
  
  Object.keys(users).forEach(user => {
    const item = document.createElement("div");
    item.className = "dropdown-item";
    item.dataset.value = user;
    item.textContent = user;
    dropdownMenu.appendChild(item);
  });

  dropdownMenu.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
      const selectedValue = item.dataset.value;
      document.getElementById("dropdown-selected").textContent = item.textContent;
      toggleNameInput(selectedValue);
      dropdownMenu.classList.remove("show");
    });
  });
}

function toggleNameInput(selectedValue) {
  const nameInput = document.getElementById("name-input");
  if (selectedValue === "new") {
    nameInput.style.display = "block";
    nameInput.focus();
  } else {
    nameInput.style.display = "none";
    nameInput.value = "";
  }
}

function showNameModal() {
  const nameModal = document.getElementById("name-modal");
  const modalContent = nameModal.querySelector(".modal-content");
  
  console.log("Opening name modal...");
  nameModal.style.opacity = "1";
  nameModal.style.visibility = "visible";
  modalContent.style.opacity = "0";
  modalContent.style.transform = "translateY(30px)";
  
  document.getElementById("dropdown-selected").textContent = "Kullanıcı Seç";
  document.getElementById("name-input").style.display = "none";
  document.getElementById("name-input").value = "";
  loadUsers();
  
  nameModal.classList.add("show");
  gsap.to(modalContent, {
    duration: 0.3,
    opacity: 1,
    y: 0,
    ease: "power3.out",
    onComplete: () => {
      console.log("Name modal opened successfully.");
    }
  });
}

function saveName() {
  const selectedValue = document.getElementById("dropdown-selected").textContent;
  const nameInput = document.getElementById("name-input").value.trim();
  const nameModal = document.getElementById("name-modal");
  let newUser = null;

  if (selectedValue === "Yeni Kullanıcı" && nameInput) {
    newUser = nameInput;
  } else if (selectedValue !== "Kullanıcı Seç" && selectedValue !== "Yeni Kullanıcı") {
    newUser = selectedValue;
  }

  if (newUser) {
    currentUser = newUser;
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (!users[currentUser]) {
      users[currentUser] = { emotionHistory: [], hasSeenOnboarding: false };
      localStorage.setItem("users", JSON.stringify(users));
    }
    localStorage.setItem("currentUser", currentUser);
    updatePlaceholder(currentUser);
    updateGreeting(currentUser);
    updateUserContainer(currentUser);
    
    document.getElementById("text-input").value = "";
    isFirstAnalysis = true;
    hideHistory();
    hideHistoryStats();
    loadHistory();
    
    gsap.to(".modal-content", {
      duration: 0.3,
      opacity: 0,
      y: 30,
      ease: "power3.out",
      onComplete: () => {
        nameModal.classList.remove("show");
        nameModal.style.opacity = "0";
        nameModal.style.visibility = "hidden";
        
        setTimeout(() => {
          if (!users[currentUser].hasSeenOnboarding) {
            startOnboarding(currentUser);
          }
        }, 100);
      }
    });
  } else {
    alert("Lütfen bir kullanıcı seçin veya yeni bir isim girin.");
  }
}

function updateUserContainer(name) {
  const userContainer = document.getElementById("user-container");
  const currentUserName = document.getElementById("current-user-name");
  currentUserName.textContent = `Kullanıcı: ${name}`;
  userContainer.classList.add("show");
  gsap.to(userContainer, {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: "power3.out"
  });
}

function updatePlaceholder(name) {
  document.getElementById("text-input").placeholder = `Ne hissediyorsun, ${name}? His ile duygularını paylaş.`;
}

function updateGreeting(name) {
  const hour = new Date().getHours();
  let greeting = "Merhaba";
  if (hour < 12) greeting = "Günaydın";
  else if (hour < 17) greeting = "İyi günler";
  else greeting = "İyi akşamlar";
  const greetingText = `${greeting}, ${name}! His ile duygularını keşfet.`;
  const greetingElement = document.getElementById("greeting");
  gsap.to(greetingElement, {
    duration: 0.5,
    opacity: 0,
    onComplete: () => {
      greetingElement.textContent = "";
      typeWriter(greetingText, greetingElement, 0);
    }
  });
}

function typeWriter(text, element, index) {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    gsap.to(element, {
      duration: 0.1,
      opacity: 1,
      onComplete: () => typeWriter(text, element, index + 1)
    });
  }
}

let onboardingStep = 0;
function getOnboardingSteps(name) {
  return [
    {
      title: `Hoş Geldin, ${name}!`,
      text: "His ile duygularını keşfetmeye hazır mısın? Hadi başlayalım!",
      highlight: null,
      position: "center"
    },
    {
      title: `${name}, Duygularını Yaz`,
      text: "Buraya hissettiklerini yaz, His seni daha iyi anlasın.",
      highlight: "#text-input",
      position: "below"
    },
    {
      title: `Analiz Zamanı, ${name}!`,
      text: "Yazdıklarını analiz etmek için bu butona tıkla.",
      highlight: "#analyze-btn",
      position: "below"
    },
    {
      title: `${name}'nin Geçmiş Analizleri`,
      text: "Sol üstte son 5 analizinizi görebilirsin.",
      highlight: "#history-container",
      position: "right"
    },
    {
      title: `${name}, Oranları İncele`,
      text: "Sol altta hislerinin dağılımını keşfet.",
      highlight: "#history-stats-container",
      position: "right"
    }
  ];
}

function startOnboarding(name) {
  onboardingStep = 0;
  const onboardingModal = document.getElementById("onboarding-modal");
  let dimOverlay = document.querySelector(".dim-overlay");
  if (!dimOverlay) {
    dimOverlay = document.createElement("div");
    dimOverlay.className = "dim-overlay";
    document.body.appendChild(dimOverlay);
  }
  
  onboardingModal.style.opacity = "1";
  onboardingModal.style.visibility = "visible";
  
  updateOnboardingStep(name);
  onboardingModal.classList.add("show");
}

function updateOnboardingStep(name) {
  const modal = document.getElementById("onboarding-modal");
  const modalContent = modal.querySelector(".onboarding-content");
  const title = document.getElementById("onboarding-title");
  const text = document.getElementById("onboarding-text");
  const button = modal.querySelector(".onboarding-buttons button:last-child");
  const dimOverlay = document.querySelector(".dim-overlay");

  document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
  
  const step = getOnboardingSteps(name)[onboardingStep];
  title.textContent = step.title;
  text.textContent = step.text;
  button.textContent = onboardingStep === getOnboardingSteps(name).length - 1 ? "Tamam" : "İleri";

  if (step.highlight) {
    const element = document.querySelector(step.highlight);
    if (element) {
      element.classList.add("highlight");
      if (step.highlight === "#history-container" || step.highlight === "#history-stats-container") {
        element.classList.add("show");
      }
      
      const rect = element.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const modalWidth = Math.min(300, windowWidth * 0.9);
      const modalHeight = modalContent.getBoundingClientRect().height || 200;
      let top, left;

      switch (step.position) {
        case "below":
          top = rect.bottom + 10;
          left = rect.left + (rect.width - modalWidth) / 2;
          break;
        case "right":
          top = rect.top + (rect.height - modalHeight) / 2;
          left = rect.right + 10;
          break;
        default:
          top = (windowHeight - modalHeight) / 2;
          left = (windowWidth - modalWidth) / 2;
      }

      top = Math.max(10, Math.min(top, windowHeight - modalHeight - 10));
      left = Math.max(10, Math.min(left, windowWidth - modalWidth - 10));

      modalContent.style.top = `${top}px`;
      modalContent.style.left = `${left}px`;
      
      dimOverlay.classList.add("show");
      
      gsap.fromTo(modalContent, {
        opacity: 0,
        scale: 0.8,
        y: 20
      }, {
        duration: 0.3,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: "back.out(1.7)"
      });
    }
  } else {
    modalContent.style.top = `calc(50% - ${modalContent.getBoundingClientRect().height / 2}px)`;
    modalContent.style.left = `calc(50% - 150px)`;
    dimOverlay.classList.add("show");
    
    gsap.fromTo(modalContent, {
      opacity: 0,
      scale: 0.8,
      y: 20
    }, {
      duration: 0.3,
      opacity: 1,
      scale: 1,
      y: 0,
      ease: "back.out(1.7)"
    });
  }
}

function nextOnboardingStep() {
  onboardingStep++;
  const modal = document.getElementById("onboarding-modal");
  const dimOverlay = document.querySelector(".dim-overlay");
  
  if (onboardingStep >= getOnboardingSteps(currentUser).length) {
    let users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[currentUser]) {
      users[currentUser].hasSeenOnboarding = true;
      localStorage.setItem("users", JSON.stringify(users));
    }
    gsap.to(".onboarding-content", {
      duration: 0.3,
      opacity: 0,
      scale: 0.8,
      y: 20,
      ease: "power3.out",
      onComplete: () => {
        modal.classList.remove("show");
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
        dimOverlay.classList.remove("show");
        document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
      }
    });
    return;
  }
  
  gsap.to(".onboarding-content", {
    duration: 0.3,
    opacity: 0,
    scale: 0.8,
    y: 20,
    ease: "power3.out",
    onComplete: () => {
      updateOnboardingStep(currentUser);
    }
  });
}

function skipOnboarding() {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (users[currentUser]) {
    users[currentUser].hasSeenOnboarding = true;
    localStorage.setItem("users", JSON.stringify(users));
  }
  const modal = document.getElementById("onboarding-modal");
  const dimOverlay = document.querySelector(".dim-overlay");
  gsap.to(".onboarding-content", {
    duration: 0.3,
    opacity: 0,
    scale: 0.8,
    y: 20,
    ease: "power3.out",
    onComplete: () => {
      modal.classList.remove("show");
      modal.style.opacity = "0";
      modal.style.visibility = "hidden";
      dimOverlay.classList.remove("show");
      document.querySelectorAll(".highlight").forEach(el => el.classList.remove("highlight"));
    }
  });
}

function updateParticleColor(emotion) {
  currentParticleColor = emotionColors[emotion] || "#ffffff";
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: currentParticleColor },
      shape: { type: "circle" },
      opacity: { value: 0.3 },
      size: { value: 3 },
      line_linked: {
        enable: true,
        distance: 120,
        color: currentParticleColor,
        opacity: 0.2,
        width: 1,
      },
      move: { enable: true, speed: 1 }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

function setupRippleEffect() {
  const canvas = document.getElementById("ripple-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let ripples = [];

  function createRipple(x, y, color) {
    ripples.push({ x, y, radius: 0, opacity: 0.5, color });
  }

  function animateRipples() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples = ripples.filter(ripple => ripple.opacity > 0);
    ripples.forEach(ripple => {
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${parseColor(ripple.color)}, ${ripple.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ripple.radius += 2;
      ripple.opacity -= 0.01;
    });
    requestAnimationFrame(animateRipples);
  }

  function parseColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  document.getElementById("analyze-btn").addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createRipple(x, y, lastEmotion ? emotionColors[lastEmotion] : "#10a37f");
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  animateRipples();
}

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: [currentParticleColor]
  });
}

function hideHistory() {
  const historyContainer = document.getElementById("history-container");
  gsap.to(historyContainer, {
    duration: 0.5,
    opacity: 0,
    y: -20,
    ease: "power3.out",
    onComplete: () => {
      historyContainer.classList.remove("show");
    }
  });
}

function hideHistoryStats() {
  const statsContainer = document.getElementById("history-stats-container");
  gsap.to(statsContainer, {
    duration: 0.5,
    opacity: 0,
    y: 20,
    ease: "power3.out",
    onComplete: () => {
      statsContainer.classList.remove("show");
    }
  });
}

function saveToHistory(emotion, text) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[currentUser]) {
    users[currentUser] = { emotionHistory: [], hasSeenOnboarding: false };
  }
  const history = users[currentUser].emotionHistory;
  const newEntry = {
    emotion,
    emoji: emojis[emotion] || "❓",
    timestamp: new Date().toLocaleString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit"
    }),
    text: text.substring(0, 50)
  };
  history.unshift(newEntry);
  if (history.length > 5) {
    history.splice(5);
  }
  users[currentUser].emotionHistory = history;
  localStorage.setItem("users", JSON.stringify(users));
  lastEmotion = emotion;
  updateParticleColor(emotion);
  updateFavicon(emotion);
  isFirstAnalysis = false;
  displayHistory(history);
  updateEmotionStats(history);
}

function loadHistory() {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const history = users[currentUser]?.emotionHistory || [];
  if (history.length > 0 && !isFirstAnalysis) {
    lastEmotion = history[0].emotion;
    updateParticleColor(lastEmotion);
    updateFavicon(lastEmotion);
    displayHistory(history);
    updateEmotionStats(history);
  } else {
    lastEmotion = null;
    updateParticleColor("Neutral");
    updateFavicon("Neutral");
    hideHistory();
    hideHistoryStats();
  }
}

function displayHistory(history) {
  const historyList = document.getElementById("history-list");
  const historyContainer = document.getElementById("history-container");
  historyList.innerHTML = "";
  if (history.length === 0 || isFirstAnalysis) {
    historyContainer.classList.remove("show");
    return;
  }
  history.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.className = "history-item";
    listItem.innerHTML = `
      <div class="history-emoji">${entry.emoji}</div>
      <div class="history-emotion">${emotionTranslations[entry.emotion] || "Bilinmeyen"}</div>
      <div class="history-time">${entry.timestamp}</div>
      <div class="history-tooltip">${entry.text || "Metin yok"}</div>
    `;
    historyList.appendChild(listItem);
    setTimeout(() => {
      gsap.to(listItem, {
        duration: 0.5,
        opacity: 1,
        x: 0,
        ease: "power3.out",
        delay: index * 0.1
      });
    }, 100);
  });
  historyContainer.classList.add("show");
  gsap.to(historyContainer, {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: "power3.out"
  });
}

function updateEmotionStats(history) {
  if (history.length === 0 || isFirstAnalysis) {
    const statsContainer = document.getElementById("history-stats-container");
    statsContainer.classList.remove("show");
    return;
  }
  const emotionCounts = {};
  const totalEntries = history.length;
  Object.keys(emojis).forEach(emotion => {
    emotionCounts[emotion] = 0;
  });
  history.forEach(entry => {
    if (emotionCounts[entry.emotion] !== undefined) {
      emotionCounts[entry.emotion]++;
    }
  });
  displayEmotionStats(emotionCounts, totalEntries);
}

function displayEmotionStats(emotionCounts, totalEntries) {
  const emotionStats = document.getElementById("emotion-stats");
  const statsContainer = document.getElementById("history-stats-container");
  emotionStats.innerHTML = "";
  const hasEmotions = Object.values(emotionCounts).some(count => count > 0);
  if (!hasEmotions || isFirstAnalysis) {
    statsContainer.classList.remove("show");
    return;
  }
  const sortedEmotions = Object.keys(emotionCounts).sort((a, b) => 
    emotionCounts[b] - emotionCounts[a]
  );
  sortedEmotions.forEach(emotion => {
    const count = emotionCounts[emotion];
    if (count === 0) return;
    const percentage = Math.round((count / totalEntries) * 100);
    const ratioBar = document.createElement("div");
    ratioBar.className = "ratio-bar";
    ratioBar.innerHTML = `
      <div class="ratio-emoji">${emojis[emotion]}</div>
      <div class="ratio-bg">
        <div class="ratio-fill emotion-${emotion}" style="width: 0%"></div>
      </div>
      <div class="ratio-value">${percentage}% (${count})</div>
    `;
    emotionStats.appendChild(ratioBar);
    setTimeout(() => {
      const ratioFill = ratioBar.querySelector(".ratio-fill");
      ratioFill.style.width = `${percentage}%`;
    }, 200);
  });
  statsContainer.classList.add("show");
  gsap.to(statsContainer, {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: "power3.out"
  });
}

async function analyzeText() {
  const text = document.getElementById("text-input").value;
  const result = document.getElementById("result");
  const resultText = document.getElementById("result-text");
  const resultIcon = document.getElementById("result-icon");
  const loadingSpinner = document.getElementById("loading-spinner");

  if (!text) {
    alert("Lütfen bir metin girin.");
    return;
  }

  loadingSpinner.style.display = "inline-block";
  loadingSpinner.textContent = lastEmotion ? emojis[lastEmotion] : "😊";
  resultText.innerText = "Analiz ediliyor...";
  resultIcon.innerText = "⏳";
  result.classList.remove("show");
  result.style.display = "block";

  try {
    const response = await fetch("https://his-backend-4k9s.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, username: currentUser || 'anonymous' })
    });

    if (!response.ok) throw new Error("Hata oluştu");

    const data = await response.json();
    await new Promise(resolve => setTimeout(resolve, 1500));
    const emotion = data.sentiment;

    resultIcon.innerText = emojis[emotion] || "❓";
    resultIcon.className = `result-icon ${emotion.toLowerCase()}`;
    resultText.innerText = `Analiz Sonucu: ${emotionTranslations[emotion] || "Bilinmeyen"}`;

    result.classList.add("show");
    if (emotion === "Happy" || emotion === "Surprise") {
      triggerConfetti();
    }
    saveToHistory(emotion, text);
  } catch (error) {
    resultText.innerText = "Bir hata oluştu.";
    resultIcon.innerText = "❌";
  } finally {
    loadingSpinner.style.display = "none";
  }
}