import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUpload } from '../service/file-upload';

@Component({
  selector: 'app-emf-formations',
  templateUrl: './emf-formations.html',
  standalone: true,
  imports: [CommonModule]
})
export class EmfFormationsComponent {
  docs: { id: number; title: string; fileName: string }[] = [];

  constructor(private fileUpload: FileUpload) {
    this.refresh();
  }

  refresh() {
    this.fileUpload.list().subscribe(list => {
      this.docs = list.map(d => ({ id: d.id, title: d.title, fileName: d.fileName }));
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
