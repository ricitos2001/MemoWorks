import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PageTransitionService {
  private isAnimating = false;
  private exitPromise: Promise<void> | null = null;

  private defaultTimeout = 1200;

  async playExit(): Promise<void> {
    if (this.isAnimating) return this.exitPromise ?? Promise.resolve();
    this.isAnimating = true;

    if (typeof window === 'undefined') {
      this.isAnimating = false;
      return Promise.resolve();
    }

    const container = this.getPageContainer();

    // import gsap dinámicamente para SSR-safety
    const { gsap } = await import('gsap');

    this.exitPromise = new Promise<void>(resolve => {
      try {
        // ya no mostramos ni animamos overlay (sin sombreado)

        const tl = gsap.timeline({
          defaults: { duration: 0.45, ease: 'power2.out' },
          onComplete: () => {
            // finalizar animación
            setTimeout(() => {
              this.isAnimating = false;
              resolve();
            }, 10);
          }
        });

        if (container) {
          tl.to(container, { y: -20, opacity: 0 });
        } else {
          // si no hay contenedor, animamos el body
          tl.to(document.body, { y: -20, opacity: 0 });
        }

        // safety timeout
        setTimeout(() => {
          if (this.isAnimating) {
            this.isAnimating = false;
            resolve();
          }
        }, this.defaultTimeout);
      } catch (e) {
        this.isAnimating = false;
        resolve();
      }
    });

    return this.exitPromise;
  }

  async playEnter(): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();

    const container = this.getPageContainer();

    const { gsap } = await import('gsap');

    return new Promise<void>(resolve => {
      try {
        const tl = gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.out' }, onComplete: () => {
          resolve();
        }});

        if (container) {
          // establecer estado inicial
          gsap.set(container, { y: 20, opacity: 0 });
          tl.to(container, { y: 0, opacity: 1 });
        } else {
          gsap.set(document.body, { y: 20, opacity: 0 });
          tl.to(document.body, { y: 0, opacity: 1 });
        }

        setTimeout(() => resolve(), this.defaultTimeout);
      } catch (e) {
        resolve();
      }
    });
  }

  private getPageContainer(): HTMLElement | null {
    if (typeof window === 'undefined') return null;
    return document.getElementById('page-container');
  }
}
