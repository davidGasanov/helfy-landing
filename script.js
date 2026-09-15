const stickyCta = document.querySelector(".mobile-cta");

function updateStickyCta() {
  const show = window.innerWidth < 900 && window.scrollY > 140;
  stickyCta.classList.toggle("is-visible", show);
}

window.addEventListener("scroll", updateStickyCta, { passive: true });
window.addEventListener("resize", updateStickyCta);
updateStickyCta();

class Carousel {
  constructor(element) {
    this.element = element;
    this.track = element.querySelector(".carousel-track");
    this.items = [...this.track.children];
    this.previous = element.querySelector(".carousel-arrow--previous");
    this.next = element.querySelector(".carousel-arrow--next");
    this.dots = element.querySelector(".carousel-dots");
    this.index = 0;
    this.pointerStart = null;

    this.items.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `Show item ${index + 1}`);
      dot.addEventListener("click", () => this.goTo(index));
      this.dots.append(dot);
    });

    this.dotButtons = [...this.dots.children];
    this.previous.addEventListener("click", () => this.goTo(this.index - 1));
    this.next.addEventListener("click", () => this.goTo(this.index + 1));
    this.track.addEventListener("pointerdown", (event) => this.startSwipe(event));
    this.track.addEventListener("pointerup", (event) => this.endSwipe(event));
    this.track.addEventListener("pointercancel", () => { this.pointerStart = null; });
    window.addEventListener("resize", () => this.render());
    this.render();
  }

  get desktopStatic() {
    return window.innerWidth >= 900;
  }

  startSwipe(event) {
    if (this.desktopStatic) return;
    this.pointerStart = event.clientX;
    this.track.setPointerCapture(event.pointerId);
  }

  endSwipe(event) {
    if (this.pointerStart === null) return;
    const distance = event.clientX - this.pointerStart;
    this.pointerStart = null;
    if (Math.abs(distance) < 45) return;
    this.goTo(this.index + (distance < 0 ? 1 : -1));
  }

  goTo(index) {
    if (this.desktopStatic) return;
    this.index = (index + this.items.length) % this.items.length;
    this.render();
  }

  render() {
    if (this.desktopStatic) this.index = 0;

    const gap = Number.parseFloat(getComputedStyle(this.track).columnGap) || 0;
    let offset = 0;
    if (!this.desktopStatic) {
      for (let i = 0; i < this.index; i++) {
        offset += this.items[i].getBoundingClientRect().width + gap;
      }
    }
    this.track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    this.dotButtons.forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === this.index));
      dot.disabled = this.desktopStatic;
    });

    this.previous.disabled = this.desktopStatic;
    this.next.disabled = this.desktopStatic;
  }
}

document.querySelectorAll("[data-carousel]").forEach((element) => new Carousel(element));
