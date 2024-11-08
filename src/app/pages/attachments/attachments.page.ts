import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.page.html',
  styleUrls: ['./attachments.page.scss'],
})
export class AttachmentsPage implements OnInit {

  selectedFile: any;
  fileUrl: string = '';
  isFileSelected: boolean = false;
  downloadLink: string = '';
  fileName: string = '';
  folderPath: string = 'ionic/attachments/';

  constructor() { }

  ngOnInit() {
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.fileUrl = URL.createObjectURL(file);
      this.isFileSelected = true;
      this.checkAndCreateFolder();
    }
  }

  async checkAndCreateFolder(): Promise<void> {
    try {
      const path = this.folderPath;
      await Filesystem.readdir({ path });

      this.downloadLink = path + this.fileName;
    } catch (error) {
      await Filesystem.mkdir({ path: this.folderPath, directory: Directory.Documents, recursive: true });
      console.log('Folder created');
      this.downloadLink = this.folderPath + this.fileName;
    }
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const path = this.folderPath + this.fileName;

    try {
      const base64Data = await this.readFileAsBase64(this.selectedFile);
      await Filesystem.writeFile({
        path: path,
        data: base64Data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('File uploaded successfully');
      this.downloadLink = path;
    } catch (error) {
      console.error('Error uploading file', error);
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  
  downloadFile(): void {
    if (!this.downloadLink) {
      console.error('No file to download');
      return;
    }

    const file = this.downloadLink;
    console.log('Downloading file from', file);
    
    const anchor = document.createElement('a');
    anchor.href = file;
    anchor.download = this.fileName;
    anchor.click();
  }

}
