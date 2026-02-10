/* =============================
   MENU (MOBILE)
============================= */
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");

if (menuIcon && navbar) {
    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("fa-x");
        navbar.classList.toggle("active");
        menuIcon.setAttribute(
            "aria-expanded",
            navbar.classList.contains("active") ? "true" : "false"
        );
    });

    menuIcon.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            menuIcon.click();
        }
    });
}

/* =============================
   ACTIVE LINK ON SCROLL
============================= */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("header nav a");
const header = document.querySelector("header");

function setActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 160;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute("id");

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const active = document.querySelector(`header nav a[href="#${id}"]`);
            if (active) active.classList.add("active");
        }
    });

    if (header) header.classList.toggle("sticky", scrollY > 100);
}

window.addEventListener("scroll", () => {
    setActiveLink();

    // Close menu when scrolling (mobile)
    if (menuIcon && navbar) {
        menuIcon.classList.remove("fa-x");
        navbar.classList.remove("active");
        menuIcon.setAttribute("aria-expanded", "false");
    }
});

// Ensure correct state on load
setActiveLink();

/* =============================
   SCROLL REVEAL
============================= */
if (typeof ScrollReveal !== "undefined") {
    ScrollReveal({
        distance: "80px",
        duration: 1800,
        delay: 200,
        reset: false,
    });

    ScrollReveal().reveal(".home-content, .heading", { origin: "top" });
    ScrollReveal().reveal(
        ".home-img, .services-container, .portfolio-box, .contact form",
        { origin: "bottom" }
    );
    ScrollReveal().reveal(".about-img", { origin: "left" });
    ScrollReveal().reveal(".about-content", { origin: "right" });
}

/* =============================
   TYPED
============================= */
if (typeof Typed !== "undefined") {
    new Typed(".multiple-text", {
        strings: [
            "Java Backend Developer Jr",
            "Full Stack Developer Jr",
            "Spring Boot",
            "REST APIs",
            "Web Application",
        ],
        typeSpeed: 70,
        backSpeed: 70,
        backDelay: 1000,
        loop: true,
    });
}

/* =============================
   CONTACT FORM (WhatsApp)
============================= */
const form = document.querySelector("#contact-form");

function setError(fieldEl, message) {
    const wrapper = fieldEl?.closest?.(".field");
    const errorEl = wrapper ? wrapper.querySelector(".error") : null;
    if (errorEl) errorEl.textContent = message;
    if (fieldEl) fieldEl.classList.toggle("input-error", Boolean(message));
}

function setTextareaError(message) {
    const el = document.querySelector(".textarea-error");
    if (el) el.textContent = message;
    const textarea = document.querySelector("#message");
    if (textarea) textarea.classList.toggle("input-error", Boolean(message));
}

function normalizePhone(value) {
    return (value || "").replace(/\D/g, "");
}

function validateForm() {
    let isValid = true;

    const fullName = document.querySelector("#fullName");
    const email = document.querySelector("#email");
    const mobile = document.querySelector("#mobile");
    const subject = document.querySelector("#subject");
    const message = document.querySelector("#message");

    // Full name
    if (!fullName?.value?.trim()) {
        setError(fullName, "Informe seu nome.");
        isValid = false;
    } else if (fullName.value.trim().length < 3) {
        setError(fullName, "Seu nome deve ter pelo menos 3 caracteres.");
        isValid = false;
    } else {
        setError(fullName, "");
    }

    // Email
    const emailValue = (email?.value || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailValue) {
        setError(email, "Informe seu e-mail.");
        isValid = false;
    } else if (!emailOk) {
        setError(email, "E-mail inválido.");
        isValid = false;
    } else {
        setError(email, "");
    }

    // Mobile (BR: 10–11 digits)
    const phone = normalizePhone(mobile?.value);
    if (!phone) {
        setError(mobile, "Informe seu telefone.");
        isValid = false;
    } else if (phone.length < 10 || phone.length > 11) {
        setError(mobile, "Telefone inválido (DDD + número).");
        isValid = false;
    } else {
        setError(mobile, "");
    }

    // Subject (select or input)
    if (!subject?.value?.trim()) {
        setError(subject, "Selecione o motivo do contato.");
        isValid = false;
    } else {
        setError(subject, "");
    }

    // Message
    if (!message?.value?.trim()) {
        setTextareaError("Escreva sua mensagem.");
        isValid = false;
    } else if (message.value.trim().length < 10) {
        setTextareaError("Mensagem muito curta (mínimo 10 caracteres).");
        isValid = false;
    } else {
        setTextareaError("");
    }

    return isValid;
}

function setStatus(text, ok = true) {
    const status = document.querySelector("#form-status");
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("ok", ok);
    status.classList.toggle("bad", !ok);
}

function clearStatus() {
    const status = document.querySelector("#form-status");
    if (!status) return;
    status.textContent = "";
    status.classList.remove("ok", "bad");
}

/* =============================
   MODAL (criado via JS)
============================= */
function ensureModal() {
    let overlay = document.querySelector(".wa-modal-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "wa-modal-overlay";
    overlay.innerHTML = `
    <div class="wa-modal" role="dialog" aria-modal="true" aria-label="Mensagem pronta">
      <h3 class="wa-title">Mensagem pronta <span class="wa-check">✅</span></h3>
      <p class="wa-desc">
        Seu WhatsApp foi aberto com a mensagem preenchida.<br/>
        Só falta <span class="wa-highlight">clicar em Enviar</span>.
      </p>

      <div class="wa-actions">
        <button type="button" class="wa-btn wa-primary" data-wa-open>Abrir WhatsApp</button>
        <button type="button" class="wa-btn wa-ghost" data-wa-close>Fechar</button>
      </div>

      <p class="wa-footnote">
        Se o WhatsApp não abrir, você pode copiar a mensagem:
        <button type="button" class="wa-link" data-wa-copy>copiar mensagem</button>
      </p>
    </div>
  `;
    document.body.appendChild(overlay);

    // click fora fecha
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) hideModal({ updateStatus: true });
    });

    // ESC fecha
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideModal({ updateStatus: true });
    });

    overlay.querySelector("[data-wa-close]")?.addEventListener("click", () => {
        hideModal({ updateStatus: true });
    });

    overlay.querySelector("[data-wa-open]")?.addEventListener("click", () => {
        if (window.__WA_URL__) window.open(window.__WA_URL__, "_blank", "noopener,noreferrer");
        setStatus("WhatsApp aberto. Se precisar, edite e clique em Enviar.", true);
    });

    overlay.querySelector("[data-wa-copy]")?.addEventListener("click", async () => {
        try {
            if (window.__WA_TEXT__) await navigator.clipboard.writeText(window.__WA_TEXT__);
            setStatus("Mensagem copiada ✅ Agora é só colar no WhatsApp.", true);
        } catch {
            setStatus("Não consegui copiar automaticamente. Copie manualmente no WhatsApp.", false);
        }
    });

    return overlay;
}

function showModal() {
    const overlay = ensureModal();
    overlay.classList.add("is-open");
    document.documentElement.classList.add("wa-lock");
}

function hideModal({ updateStatus = false } = {}) {
    const overlay = document.querySelector(".wa-modal-overlay");
    if (!overlay) return;

    overlay.classList.remove("is-open");
    document.documentElement.classList.remove("wa-lock");

    // ✅ aqui é o ajuste que você pediu:
    // quando fechar o modal, muda a frase abaixo do formulário
    if (updateStatus) {
        setStatus("Mensagem preparada. Fique à vontade para enviar quando quiser.", true);
    }
}

// garante que não fica preso após refresh
hideModal({ updateStatus: false });

/* =============================
   SUBMIT HANDLER
============================= */
if (form) {
    // Live validation (on blur)
    form.querySelectorAll("input, textarea, select").forEach((el) => {
        el.addEventListener("blur", validateForm);
    });

    form.addEventListener("submit", (e) => {
        // ✅ impede voltar para o topo / recarregar
        e.preventDefault();
        e.stopPropagation();

        const ok = validateForm();
        if (!ok) {
            setStatus("Revise os campos destacados e tente novamente.", false);
            return;
        }

        const WHATSAPP_NUMBER = "5511977514777";

        const fullName = document.querySelector("#fullName")?.value?.trim() || "";
        const email = document.querySelector("#email")?.value?.trim() || "";
        const mobile = document.querySelector("#mobile")?.value?.trim() || "";
        const subject = document.querySelector("#subject")?.value?.trim() || "";
        const message = document.querySelector("#message")?.value?.trim() || "";

        const subjectLabelMap = {
            vaga: "Oportunidade de trabalho",
            freela: "Projeto / Freelance",
            parceria: "Parceria técnica",
            duvida: "Dúvida técnica",
            outro: "Outro assunto",
        };

        const assunto = subjectLabelMap[subject] || subject || "Contato";

        const text =
            `Olá Samara, tudo bem?

Acessei seu portfólio e gostaria de conversar melhor.

Nome: ${fullName}
E-mail: ${email}
Telefone: ${mobile}
Assunto: ${assunto}

Mensagem:
${message}

Fico no aguardo do seu retorno. Obrigado(a)!`;

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

        // guarda para botões do modal
        window.__WA_TEXT__ = text;
        window.__WA_URL__ = url;

        // abre WhatsApp
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus("Abrindo WhatsApp para envio…", true);

        // mostra modal (UX)
        showModal();

        // opcional: limpar
        form.reset();
        form.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
        form.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
        setTextareaError("");
    });
}

/* =============================
   FOOTER YEAR
============================= */
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
