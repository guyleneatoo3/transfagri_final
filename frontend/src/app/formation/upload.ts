import { Component, Inject } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../service/file-upload';


@Component({
  selector: 'app-upload',
  template: `
    <div>
      <input type="file" (change)="onFileSelected($event)" accept="application/pdf" />
      <button (click)="upload()" [disabled]="!selectedFile">Téléverser</button>
      <div *ngIf="message">{{ message }}</div>
      <div *ngIf="progress > 0 && progress < 100">Progression: {{ progress }}%</div>
      <div *ngIf="uploadSuccess">Le fichier a été téléversé avec succès.</div>
    </div>
  `,
  // styleUrls: ['./upload.component.css']
  imports: [CommonModule]
})
export class UploadComponent {
  selectedFile?: File;
  message = '';
  progress = 0;
  uploadSuccess = false;

  constructor(@Inject(FileUpload) private uploadService: FileUpload) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.message = '';
    } else {
      this.message = '❌ Veuillez sélectionner un fichier PDF uniquement.';
      this.uploadSuccess = false;
      this.selectedFile = undefined;
    }
  }

  upload(): void {
    if (this.selectedFile) {
      this.progress = 0;
      this.uploadService.upload(this.selectedFile).subscribe({
        next: (event: import('@angular/common/http').HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.message = '✅ Fichier téléversé avec succès.';
            this.uploadSuccess = true;
          }
        },
        error: () => {
          this.message = '❌ Erreur lors du téléversement.';
          this.uploadSuccess = false;
          this.progress = 0;
        }
      });
    }
  }
}

