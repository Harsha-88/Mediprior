export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  userId: string;
}

export interface UploadResponse {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

class UploadService {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  private getStorageKey(userId: string): string {
    return `uploaded_files_${userId}`;
  }

  private saveFilesToStorage(userId: string, files: UploadedFile[]): void {
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(files));
    } catch (error) {
      console.error('Failed to save files to storage:', error);
    }
  }

  private getFilesFromStorage(userId: string): UploadedFile[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      if (stored) {
        const files = JSON.parse(stored);
        // Convert string dates back to Date objects
        return files.map((file: any) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load files from storage:', error);
    }
    return [];
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.maxFileSize) {
      return {
        isValid: false,
        error: `File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not supported. Please upload PDF, image, or document files.'
      };
    }

    return { isValid: true };
  }

  async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('uploadedAt', new Date().toISOString());

      // Simulate upload with progress (replace with actual API call)
      return await this.simulateUpload(formData, onProgress);

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: 'Upload failed. Please try again.'
      };
    }
  }

  private async simulateUpload(
    formData: FormData,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResponse> {
    return new Promise((resolve) => {
      const file = formData.get('file') as File;
      const userId = formData.get('userId') as string;
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Create file URL (in real app, this would be the server URL)
          const fileUrl = URL.createObjectURL(file);
          
          // Create uploaded file object
          const uploadedFile: UploadedFile = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            url: fileUrl,
            uploadedAt: new Date(),
            userId: userId
          };

          // Save to storage
          const existingFiles = this.getFilesFromStorage(userId);
          existingFiles.unshift(uploadedFile); // Add to beginning
          this.saveFilesToStorage(userId, existingFiles);

          resolve({
            success: true,
            file: uploadedFile
          });
        } else {
          onProgress?.({
            loaded: (progress / 100) * file.size,
            total: file.size,
            percentage: Math.round(progress)
          });
        }
      }, 200);
    });
  }

  async getUploadedFiles(userId: string): Promise<UploadedFile[]> {
    // Get files from storage
    return new Promise((resolve) => {
      setTimeout(() => {
        const files = this.getFilesFromStorage(userId);
        resolve(files);
      }, 300);
    });
  }

  async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Find the file to get userId
          const allKeys = Object.keys(localStorage);
          const fileKeys = allKeys.filter(key => key.startsWith('uploaded_files_'));
          
          for (const key of fileKeys) {
            const userId = key.replace('uploaded_files_', '');
            const files = this.getFilesFromStorage(userId);
            const fileIndex = files.findIndex(f => f.id === fileId);
            
            if (fileIndex !== -1) {
              // Revoke the object URL to free memory
              URL.revokeObjectURL(files[fileIndex].url);
              
              // Remove file from array
              files.splice(fileIndex, 1);
              
              // Save updated files
              this.saveFilesToStorage(userId, files);
              
              resolve({ success: true });
              return;
            }
          }
          
          resolve({ success: false, error: 'File not found' });
        } catch (error) {
          resolve({ success: false, error: 'Failed to delete file' });
        }
      }, 300);
    });
  }
}

export const uploadService = new UploadService(); 