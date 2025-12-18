import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { UserService } from '../user.service';

export interface AvatarPayload {
  src: string;
  v: number; // versión para forzar cambios
}

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private avatarSubject = new BehaviorSubject<AvatarPayload | null>(null);
  public avatar$: Observable<AvatarPayload | null> = this.avatarSubject.asObservable();

  private currentObjectUrl?: string;

  constructor(private userService: UserService) {}

  private localKey(userId: number) {
    return `avatar_${userId}`;
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error leyendo blob como dataURL'));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  private dataURLToBlob(dataUrl: string): Blob {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  private setObjectUrlFromBlob(blob: Blob) {
    if (this.currentObjectUrl) {
      try { URL.revokeObjectURL(this.currentObjectUrl); } catch (e) { /* ignore */ }
    }
    this.currentObjectUrl = URL.createObjectURL(blob);
    console.info('[AvatarService] emit objectURL, size=', blob.size, 'url=', this.currentObjectUrl);
    this.avatarSubject.next({ src: this.currentObjectUrl, v: Date.now() });
  }

  private detectMime(buffer: ArrayBuffer): string | null {
    const bytes = new Uint8Array(buffer);
    if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'image/png';
    if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'image/jpeg';
    if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) return 'image/gif';
    if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
    return null;
  }

  setLocalAvatar(userId: number, dataUrl: string): void {
    try {
      localStorage.setItem(this.localKey(userId), dataUrl);
      console.info('[AvatarService] emit dataURL (local), length=', dataUrl.length, 'userId=', userId);
      this.avatarSubject.next({ src: dataUrl, v: Date.now() });
      return;
    } catch (e) {
      console.warn('[AvatarService] no se pudo escribir localStorage (fallback a objectURL)', e);
    }

    try {
      const blob = this.dataURLToBlob(dataUrl);
      this.setObjectUrlFromBlob(blob);
    } catch (err) {
      console.error('[AvatarService] no se pudo convertir dataURL para fallback', err);
      this.avatarSubject.next(null);
    }
  }

  setObjectUrlFromFile(file: File | Blob): void {
    try {
      const blob = file instanceof Blob ? file : new Blob([file]);
      this.setObjectUrlFromBlob(blob);
    } catch (err) {
      console.error('[AvatarService] error creando objectURL desde File', err);
    }
  }

  async loadAvatar(userId: number): Promise<void> {
    if (!userId) return;

    let cached: string | null = null;

    try {
      cached = localStorage.getItem(this.localKey(userId));
      if (cached) {
        this.avatarSubject.next({ src: cached, v: Date.now() });
      }
    } catch (e) {
      console.warn('[AvatarService] no se pudo leer localStorage', e);
    }

    this.userService.getImageProfile(userId).subscribe({
      next: async (blob: Blob) => {
        try {
          if (!blob || blob.size === 0) {
            console.warn('[AvatarService] Blob vacío para userId', userId);
            if (!cached) this.avatarSubject.next(null);
            return;
          }

          let finalBlob: Blob | null = blob;
          let type = (blob.type || '').toLowerCase();

          if (!type.startsWith('image/')) {
            try {
              const buffer = await blob.arrayBuffer();
              const detected = this.detectMime(buffer);
              if (detected) {
                finalBlob = new Blob([buffer], { type: detected });
                console.info('[AvatarService] MIME detectado y aplicado:', detected, 'para userId', userId);
              } else {
                try { const txt = new TextDecoder().decode(buffer); console.warn('[AvatarService] respuesta no-imagen (texto):', txt.slice(0,200)); } catch (e) {}
                if (!cached) this.avatarSubject.next(null);
                return;
              }
            } catch (err) {
              console.error('[AvatarService] error al analizar blob para detectar MIME', err);
              if (!cached) this.avatarSubject.next(null);
              return;
            }
          }

          const dataUrl = await this.blobToDataURL(finalBlob as Blob);
          try {
            localStorage.setItem(this.localKey(userId), dataUrl);
            console.info('[AvatarService] emit dataURL, length=', dataUrl.length, 'userId=', userId);
            this.avatarSubject.next({ src: dataUrl, v: Date.now() });
          } catch (e) {
            console.warn('[AvatarService] no se pudo escribir localStorage (fallback a objectURL) al cargar avatar', e);
            this.setObjectUrlFromBlob(finalBlob as Blob);
          }
        } catch (err) {
          console.error('[AvatarService] error procesando blob', err);
          if (!cached) this.avatarSubject.next(null);
        }
      },
      error: (err) => {
        console.error('[AvatarService] error al obtener avatar para userId', userId, err);
        try {
          if (!cached) this.avatarSubject.next(null);
        } catch (e) {
          this.avatarSubject.next(null);
        }
      }
    });
  }

  async pollForAvatar(userId: number, attempts = 5, intervalMs = 700): Promise<void> {
    if (!userId) return;

    for (let i = 0; i < attempts; i++) {
      try {
        const blob = await firstValueFrom(this.userService.getImageProfile(userId, true));
        if (blob && blob.size > 0) {
          let finalBlob: Blob | null = blob;
          let type = (blob.type || '').toLowerCase();
          if (!type.startsWith('image/')) {
            try {
              const buffer = await blob.arrayBuffer();
              const detected = this.detectMime(buffer);
              if (detected) {
                finalBlob = new Blob([buffer], { type: detected });
                console.info('[AvatarService] MIME detectado y aplicado (poll):', detected, 'para userId', userId);
              } else {
                console.warn('[AvatarService] poll: respuesta no-imagen o sin tipo');
                await new Promise(res => setTimeout(res, intervalMs));
                continue;
              }
            } catch (err) {
              console.warn('[AvatarService] poll: error detectando MIME', err);
              await new Promise(res => setTimeout(res, intervalMs));
              continue;
            }
          }

          const dataUrl = await this.blobToDataURL(finalBlob as Blob);
          try { localStorage.setItem(this.localKey(userId), dataUrl); this.avatarSubject.next({ src: dataUrl, v: Date.now() }); return; } catch (e) {
            console.warn('[AvatarService] no se pudo escribir localStorage (fallback a objectURL) en polling', e);
            this.setObjectUrlFromBlob(finalBlob as Blob);
            return;
          }
        }
      } catch (err: any) {
        console.warn('[AvatarService] intento', i + 1, 'falló al obtener avatar (catch):', err);
        try {
          const possibleBlob = err && err.error instanceof Blob ? err.error : null;
          if (possibleBlob) {
            const text = await possibleBlob.text();
            console.warn('[AvatarService] contenido del error (blob->text):', text.slice(0, 1000));
          } else if (err && typeof err === 'object') {
            console.warn('[AvatarService] HttpErrorResponse details:', {
              status: err.status,
              statusText: err.statusText,
              url: err.url,
              message: err.message
            });
          }
        } catch (readErr) {
          console.warn('[AvatarService] no se pudo leer contenido del error para debug', readErr);
        }
      }
      await new Promise(res => setTimeout(res, intervalMs));
    }
    console.warn('[AvatarService] no se pudo obtener avatar del servidor tras', attempts, 'intentos');
  }

  clear(userId?: number): void {
    try {
      if (userId) {
        localStorage.removeItem(this.localKey(userId));
      } else {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('avatar_')) localStorage.removeItem(k);
        });
      }
    } catch (e) {
      console.warn('[AvatarService] error limpiando localStorage', e);
    }
    if (this.currentObjectUrl) {
      try { URL.revokeObjectURL(this.currentObjectUrl); } catch (e) { /* ignore */ }
      this.currentObjectUrl = undefined;
    }
    this.avatarSubject.next(null);
  }
}
