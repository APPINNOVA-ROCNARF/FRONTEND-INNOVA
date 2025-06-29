import { Component } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
@Component({
  selector: 'app-version-app',
  standalone: true,
  imports: [
    NzCardModule,
    NzButtonModule,
    NzStepsModule,
    NzTagModule,
    NzModalModule,
    NzAlertModule,
    NzAvatarModule,
    NzDividerModule,
    NzIconModule,
    CommonModule,
    NzTabsModule,
    NzTimelineModule
  ],
  templateUrl: './version-app.component.html',
  styleUrl: './version-app.component.less',
})
export class VersionAppComponent {
  isDownloading = false;
  isQRVisible = false;
  currentStep = 0;

   appInfo = {
    name: 'Aplicación INNOVA',
    description: 'Aplicativo para uso de visitadores médicos y vendedores',
    version: '3.1.0',
    size: '52.2 MB',
    minAndroidVersion: '7.0',
    icon: '', 
    changelog: [
      {
        version: '2.1.3',
        date: '24 de Junio, 2025',
        changes: [
          {
            type: 'new',
            items: [
              'Nueva interfaz de usuario más moderna',
              'Integración con servicios de almacenamiento en la nube',
              'Modo oscuro mejorado con temas personalizables'
            ]
          },
          {
            type: 'improved',
            items: [
              'Velocidad de carga 40% más rápida',
              'Optimización del consumo de batería',
              'Mejor rendimiento en dispositivos de gama baja'
            ]
          },
          {
            type: 'fixed',
            items: [
              'Corregido error de sincronización',
              'Solucionado problema con notificaciones',
              'Arreglado crash al rotar la pantalla'
            ]
          }
        ]
      },
      {
        version: '2.0.8',
        date: '15 de Mayo, 2025',
        changes: [
          {
            type: 'new',
            items: [
              'Sistema de respaldo automático',
              'Widgets para pantalla de inicio'
            ]
          },
          {
            type: 'improved',
            items: [
              'Interfaz más intuitiva',
              'Reducción del tamaño de la app en 15%'
            ]
          },
          {
            type: 'fixed',
            items: [
              'Corregidos múltiples errores menores',
              'Mejorada la estabilidad general'
            ]
          }
        ]
      }
    ]
  };
  apkDownloadUrl = ''; 

  constructor(private message: NzMessageService) {}





  async downloadApk() {
    this.isDownloading = true;
    
    try {
      // Simular descarga (reemplaza con tu lógica real)
      await this.simulateDownload();
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = this.apkDownloadUrl;
      link.download = `${this.appInfo.name.replace(/\s+/g, '_')}_v${this.appInfo.version}.apk`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.message.success('¡Descarga iniciada! Revisa tu carpeta de descargas.');
      this.currentStep = 2;
      
    } catch (error) {
      this.message.error('Error al descargar el archivo. Inténtalo de nuevo.');
    } finally {
      this.isDownloading = false;
    }
  }

  private simulateDownload(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  openQRCode() {
    this.isQRVisible = true;
  }

  closeQRCode() {
    this.isQRVisible = false;
  }

  async shareLink() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.appInfo.name,
          text: this.appInfo.description,
          url: window.location.href
        });
      } catch (error) {
        this.copyToClipboard();
      }
    } else {
      this.copyToClipboard();
    }
  }

  private copyToClipboard() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.message.success('Enlace copiado al portapapeles');
    }).catch(() => {
      this.message.error('No se pudo copiar el enlace');
    });
  }
}