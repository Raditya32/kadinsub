// ===== NAVBAR GLASS EFFECT ON SCROLL =====
window.addEventListener(
  "scroll",
  function () {
    const header = document.querySelector("header");
    if (!header) return;

    const scrollY = window.scrollY;

    if (scrollY === 0) {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.backdropFilter = "blur(15px)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.05)";
    } else if (scrollY > 50 && scrollY <= 200) {
      header.style.background = "rgba(255, 255, 255, 0.6)"; // Lebih transparan
      header.style.backdropFilter = "blur(35px)";
      header.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
    } else if (scrollY > 200) {
      header.style.background = "rgba(255, 255, 255, 0.4)"; // Sangat transparan
      header.style.backdropFilter = "blur(45px)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.08)";
    }
  },
  { passive: true }
);

// ===== MOBILE MENU TOGGLE =====
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) {
    console.log("⚠️ Menu button atau mobile menu tidak ditemukan");
    return;
  }

  // Create overlay element
  let overlay = document.getElementById("mobileOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    overlay.id = "mobileOverlay";
    document.body.appendChild(overlay);
  }

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    console.log("🍔 Menu toggled:", isOpen);

    if (isOpen) {
      mobileMenu.classList.add("show");
      overlay.classList.add("show");
      menuBtn.classList.add("active");
      mobileMenu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.classList.remove("show");
      overlay.classList.remove("show");
      menuBtn.classList.remove("active");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  // Toggle on button click
  menuBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  });

  // Close on overlay click
  overlay.addEventListener("click", function () {
    if (isOpen) toggleMenu();
  });

  // Close when clicking menu link
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (isOpen) {
        setTimeout(toggleMenu, 200);
      }
    });
  });

  // Close on resize to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > 820 && isOpen) {
      toggleMenu();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      toggleMenu();
    }
  });

  console.log("✅ Mobile menu initialized successfully");
});

// ===== SCROLL PROGRESS BAR =====
window.addEventListener("scroll", () => {
  const scrollProgress = document.getElementById("scrollProgress");
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / scrollHeight) * 100;
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + "%";
  }
});

// ===== SCROLL REVEAL ANIMATION =====
const observeElements = () => {
  const elements = document.querySelectorAll(
    ".card, .section h2, .section p.lead"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("scroll-reveal", "active");
          }, index * 100);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elements.forEach((el) => {
    el.classList.add("scroll-reveal");
    observer.observe(el);
  });
};

// ===== ACTIVE NAV HIGHLIGHT ON SCROLL =====
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  let currentSection = "";
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = sectionId;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + currentSection) {
      link.classList.add("active");
    }
  });
});

// Smooth scroll
document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== SLIDER =====
window.addEventListener("load", function () {
  const slidesContainer = document.getElementById("slides");
  const dotsContainer = document.getElementById("dots");

  if (!slidesContainer) {
    console.error("❌ Element #slides tidak ditemukan");
    return;
  }

  const slides = slidesContainer.querySelectorAll(".slide");
  const totalSlides = slides.length;

  if (totalSlides === 0) {
    console.error("❌ Tidak ada .slide ditemukan");
    return;
  }

  console.log("✅ Slider loaded dengan", totalSlides, "slides");

  let currentSlide = 0;
  const autoSlideInterval = 6000;
  let autoSlideTimer = null;

  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function goToSlide(n) {
    currentSlide = n;
    if (currentSlide >= totalSlides) currentSlide = 0;
    if (currentSlide < 0) currentSlide = totalSlides - 1;

    const offset = currentSlide * 100;
    slidesContainer.style.transform = "translateX(-" + offset + "%)";

    console.log("→ Moving to slide", currentSlide);

    updateDots();
    resetAutoSlide();
  }

  function startAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);

    autoSlideTimer = setInterval(function () {
      currentSlide++;
      if (currentSlide >= totalSlides) currentSlide = 0;
      goToSlide(currentSlide);
    }, autoSlideInterval);
  }

  function resetAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slidesContainer.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slidesContainer.addEventListener(
    "touchmove",
    function (e) {
      touchEndX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slidesContainer.addEventListener("touchend", function (e) {
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      goToSlide(currentSlide + (diff > 0 ? 1 : -1));
    }

    touchStartX = 0;
    touchEndX = 0;
  });

  createDots();
  startAutoSlide();
  console.log("✅ Slider initialized successfully!");
});

// ===== DOM CONTENT LOADED =====
window.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll reveal
  observeElements();

  // ==== DOWNLOAD BUTTON ====
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = "./Document/ADART.pdf";
      link.download = "AD_ART_KADIN.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
  // ==== DOWNLOAD BUTTON ====
  const downloadbtn = document.getElementById("downloadbtn");
  if (downloadbtn) {
    downloadbtn.addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = "./Document/sbu.pdf";
      link.download = "SERTIFIKAT_BADAN_USAHA.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ==== DOWNLOAD BUTTON ====
  const downloadbttn = document.getElementById("downloadbttn");
  if (downloadbttn) {
    downloadbttn.addEventListener("click", function () {
      const link = document.createElement("a");
      link.href = "./Document/coo.pdf";
      link.download = "Certificate_of_Origin.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  console.log("✅ Semua event listener terpasang dengan aman");
});

// ===== MODAL PENGURUS HANDLER =====
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const pengurusCards = document.querySelectorAll(".pengurus-card");
    const modalPengurus = document.getElementById("modalPengurus");

    if (!pengurusCards.length || !modalPengurus) {
      console.log("⚠️ Pengurus cards atau modal tidak ditemukan");
      return;
    }

    const modalImg = document.getElementById("modalPengurusImg");
    const modalName = document.getElementById("modalPengurusName");
    const modalRole = document.getElementById("modalPengurusRole");
    const closeBtn = document.getElementById("closePengurusBtn");

    pengurusCards.forEach((card) => {
      card.addEventListener("click", () => {
        modalImg.src = card.dataset.photo;
        modalName.textContent = card.dataset.name;
        modalRole.textContent = card.dataset.role;
        modalPengurus.classList.add("show");
        document.body.style.overflow = "hidden";
      });
    });

    function closeModal() {
      modalPengurus.classList.remove("show");
      document.body.style.overflow = "";
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modalPengurus.addEventListener("click", (e) => {
      if (e.target === modalPengurus) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalPengurus.classList.contains("show")) {
        closeModal();
      }
    });

    console.log("✅ Modal pengurus initialized");
  });
})();

// ===== INTERSECTION OBSERVER UNTUK ANIMASI SCROLL PENGURUS CARDS =====
document.addEventListener("DOMContentLoaded", function () {
  const pengurusCards = document.querySelectorAll(".pengurus-card");

  if (!pengurusCards.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const animateOnScroll = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  pengurusCards.forEach((card) => {
    card.style.animationPlayState = "paused";
    animateOnScroll.observe(card);
  });

  console.log("✅ Pengurus cards scroll animation initialized");
});

// === CHAT BUBBLE ANIMATION ===
document.addEventListener("DOMContentLoaded", function () {
  const chatBubble = document.querySelector(".chat-bubble");

  if (!chatBubble) return;

  // Tampilkan expanded saat pertama kali load
  chatBubble.classList.add("initial-expanded");

  // Setelah 5 detik, kecilkan chat bubble
  setTimeout(() => {
    chatBubble.classList.remove("initial-expanded");
  }, 5000); // 5000ms = 5 detik

  console.log("✅ Chat bubble animation initialized");
});

// Tunggu sampai DOM loaded
document.addEventListener("DOMContentLoaded", function () {
  const scrollToTopBtn = document.getElementById("scrollToTop");

  if (!scrollToTopBtn) {
    console.error("Tombol scroll to top tidak ditemukan!");
    return;
  }

  // Tampilkan tombol saat scroll ke bawah
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("show");
    } else {
      scrollToTopBtn.classList.remove("show");
    }
  });

  // Scroll ke atas saat tombol diklik
  scrollToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

// Tab switching functionality
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and contents
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Show corresponding content
    const tabId = button.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");

    // Scroll tab into view on mobile
    if (window.innerWidth < 1024) {
      button.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  });
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const activeButton = document.querySelector(".tab-button.active");
  const allButtons = Array.from(tabButtons);
  const currentIndex = allButtons.indexOf(activeButton);

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % allButtons.length;
    allButtons[nextIndex].click();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    const prevIndex =
      (currentIndex - 1 + allButtons.length) % allButtons.length;
    allButtons[prevIndex].click();
  }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const contentPanel = document.querySelector(".content-panel");

contentPanel.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

contentPanel.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const activeButton = document.querySelector(".tab-button.active");
  const allButtons = Array.from(tabButtons);
  const currentIndex = allButtons.indexOf(activeButton);

  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left - next tab
    const nextIndex = (currentIndex + 1) % allButtons.length;
    allButtons[nextIndex].click();
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right - previous tab
    const prevIndex =
      (currentIndex - 1 + allButtons.length) % allButtons.length;
    allButtons[prevIndex].click();
  }
}

function showTab(tabId) {
  // Hide all tab contents
  var contents = document.querySelectorAll(".tab-content");
  for (var i = 0; i < contents.length; i++) {
    contents[i].classList.remove("active");
  }

  // Remove active class from all buttons
  var buttons = document.querySelectorAll(".tab-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }

  // Show selected tab content
  var selectedContent = document.getElementById(tabId);
  if (selectedContent) {
    selectedContent.classList.add("active");
  }

  // Add active class to clicked button
  var clickedButton = event.target;
  if (clickedButton) {
    clickedButton.classList.add("active");

    // Scroll button into view on mobile
    if (window.innerWidth < 1024) {
      clickedButton.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
}
