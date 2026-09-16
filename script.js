// =========================================================
// Opala — interações da landing page
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao clicar em um link (mobile)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Botão "voltar ao topo" ---------- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Formulário da seção "Quer experimentar a Opala?" ---------- */
  const ctaForm = document.getElementById('ctaForm');
  const formFeedback = document.getElementById('formFeedback');

  if (ctaForm && formFeedback) {
    ctaForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = ctaForm.querySelector('#ctaEmail');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email) {
        formFeedback.textContent = 'Digite um e-mail para continuar.';
        return;
      }

      // Aqui entraria a chamada real para o backend/CRM.
      formFeedback.textContent = `Pronto! Enviamos as próximas etapas para ${email}.`;
      ctaForm.reset();
    });
  }

  /* ---------- Revelação suave dos cards ao rolar a página ---------- */
  const revealTargets = document.querySelectorAll(
    '.step-card, .phase-card, .feature-card, .institution-stat, .ai-card'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

});
