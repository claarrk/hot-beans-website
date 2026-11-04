// Application form: pre-select the job from ?job=..., inline validation.
// There is no server yet, so a valid submit only shows a confirmation.

(() => {
  const form = document.getElementById("application");
  if (!form) return;

  const status = document.getElementById("form-status");
  const job = form.elements.jobtitle;

  const wanted = new URLSearchParams(location.search).get("job");
  if (wanted && job.querySelector(`option[value="${CSS.escape(wanted)}"]`)) {
    job.value = wanted;
  }

  const rules = {
    fname: (v) => (v ? "" : "Enter your first name."),
    sname: (v) => (v ? "" : "Enter your surname."),
    jobtitle: (v) => (v ? "" : "Choose the role you're applying for."),
    birthday: (v) => {
      if (!v) return "Enter your date of birth.";
      return new Date(v) > new Date() ? "Date of birth can't be in the future." : "";
    },
    tel: (v) => {
      if (!v) return "Enter a phone number.";
      return /^[+()\d\s-]{7,}$/.test(v) ? "" : "Use digits, spaces, +, - or brackets only.";
    },
    email: (v) => {
      if (!v) return "Enter an email address.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@example.com.";
    },
  };

  function check(name) {
    const field = form.elements[name];
    const message = rules[name](field.value.trim());
    const error = document.getElementById(`${name}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) {
      error.textContent = message;
      field.setAttribute("aria-describedby", error.id);
    }
    return !message;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => check(name));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") check(name);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const failed = Object.keys(rules).filter((name) => !check(name));

    if (failed.length) {
      status.className = "form-status is-error";
      status.textContent = `${failed.length} field${failed.length > 1 ? "s need" : " needs"} attention.`;
      form.elements[failed[0]].focus();
      return;
    }

    status.className = "form-status is-ok";
    status.textContent = "Thanks — your application is ready. (No server is connected yet, so nothing was sent.)";
  });
})();
