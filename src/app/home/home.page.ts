import { Component, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { StorageService } from '../Services/storage.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  imageUrl: string | undefined;
  photo: SafeResourceUrl | any;
  modalPPhoto: SafeResourceUrl | any;
  picName: string | undefined;
  // selectedFile: File | undefined;
  platformName: string = '';

  selectedFile: any;
  fileUrl: string = '';
  isFileSelected: boolean = false;
  downloadLink: string = '';
  fileName: string = '';
  folderPath: string = 'ionic/attachments/';

  images: LocalFile[] = [];

  constructor(
    private _sanitizer: DomSanitizer,
    private _storage: StorageService,
    private plt: Platform,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
  }

  async ngOnInit() {
    console.log(await this._storage.get('login'));
    // await this._storage.set('username', 'IonicUser');
    // const username = await this._storage.get('username');
    // console.log('Username:', username);

    this.loadFiles();
  }

  async clickPicture() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
    });
    this.imageUrl = image.webPath;

    if (image && image.webPath) {

      let blob = await fetch(image.webPath).then((r) => r.blob());
      let filename = 'cam_' + 'kkt' + ".jpg";
      // this.picName = filename;
      this.selectedFile = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
      this.photo = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
      await this._storage.set('pic', filename);
    }
  }

  async getPhoto() {
    this.picName = await this._storage.get('pic');
  }

  async getPlatform() {
    this.platformName = await this._storage.get('platform')
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      this.fileUrl = URL.createObjectURL(file);
      this.isFileSelected = true;
    }
  }

  downloadFile(): void {
    if (this.selectedFile) {
      const link = document.createElement('a');
      link.href = this.fileUrl!;
      link.download = this.selectedFile.name; // Download with the original file name
      link.click();
    }
  }

  // Download file with a custom name
  downloadFileWithName(customName: string): void {
    if (this.selectedFile) {
      const link = document.createElement('a');
      link.href = this.fileUrl!;
      link.download = customName + '.' + this.selectedFile.name.split('.').pop(); // Use the custom name with the original file extension
      link.click();
    }
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present();

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data
    })
      .then(
        (result) => {
          this.loadFileData(result.files.map((x) => x.name));
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`
      });
    }
  }

  // Little helper
  async presentToast(text: any) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }


  async startUpload(file: LocalFile) {
    // TODO
  }

  async deleteImage(file: LocalFile) {
    // TODO
  }



  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos // Camera, Photos or Prompt!
    });

    if (image) {
      this.saveImage(image)
    }
  }

  // Create a new file from a capture image
  async saveImage(photo: Photo) {
    if (photo) {
      const base64Data = await this.readAsBase64(photo);

      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Data
      });
      this.loadFiles();
    }
  }

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid') && photo && photo.path) {
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath ?? '');
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  // Helper function
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async writeHelloFile() {
    try {
      await Filesystem.writeFile({
        path: 'hello.txt',
        data: 'Hello, this is a message!',
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log(Directory.Documents);
      console.log('File written successfully');
      const toast = await this.toastCtrl.create({
        message: "Succes",
        duration: 3000
      });
      toast.present();
    } catch (error:any) {
      console.error('Unable to write file', error);
      const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.present();
    }
  }

}
