import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../service/file-upload';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-gestion-formation',
  templateUrl: './gestion-formation.html',
  styleUrls: ['./gestion-formation.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GestionFormationComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadedFiles: string[] = [];
  message: string = '';

  constructor(private fileUpload: FileUpload) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fileUpload.upload(this.selectedFile).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Fichier téléversé avec succès !';
          this.uploadedFiles.push(this.selectedFile!.name);
          this.selectedFile = null;
          this.uploadProgress = 0;
        }
      }, err => {
        this.message = 'Erreur lors du téléversement.';
      });
    }
  }
}