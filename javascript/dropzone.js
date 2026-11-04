// CV upload drop zone: click, keyboard (Enter/Space) or drag-and-drop a file.

document.querySelectorAll(".drop-zone__input").forEach((input) => {
  const zone = input.closest(".drop-zone");

  zone.addEventListener("click", (e) => {
    if (e.target !== input) input.click();
  });

  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      input.click();
    }
  });

  input.addEventListener("change", () => {
    if (input.files.length) updateThumbnail(zone, input.files[0]);
  });

  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    zone.addEventListener(type, () => zone.classList.remove("drop-zone--over"));
  });

  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      input.files = e.dataTransfer.files;
      updateThumbnail(zone, e.dataTransfer.files[0]);
    }
    zone.classList.remove("drop-zone--over");
  });
});

function updateThumbnail(zone, file) {
  zone.querySelectorAll(".drop-zone__prompt, .drop-zone__hint").forEach((el) => el.remove());

  let thumb = zone.querySelector(".drop-zone__thumb");
  if (!thumb) {
    thumb = document.createElement("div");
    thumb.className = "drop-zone__thumb";
    zone.appendChild(thumb);
  }
  thumb.dataset.label = file.name;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      thumb.style.backgroundImage = `url('${reader.result}')`;
    };
    reader.readAsDataURL(file);
  } else {
    thumb.style.backgroundImage = "";
  }
}
