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
  title: string = '';
  uploadProgress: number = 0;
  uploadedFiles: { id: number; title: string; fileName: string }[] = [];
  message: string = '';

  constructor(private fileUpload: FileUpload) {}

  ngOnInit() {
    this.refreshList();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.fileUpload.upload(this.selectedFile, this.title || this.selectedFile.name).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Fichier téléversé avec succès !';
          this.title = '';
          this.refreshList();
          this.selectedFile = null;
          this.uploadProgress = 0;
        }
      }, err => {
        this.message = 'Erreur lors du téléversement.';
      });
    }
  }

  refreshList() {
    this.fileUpload.list().subscribe(list => {
      this.uploadedFiles = list.map(d => ({ id: d.id, title: d.title, fileName: d.fileName }));
    });
  }

  download(id: number) {
    this.fileUpload.download(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}