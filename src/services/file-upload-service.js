class FileUploadService {
    constructor({ fileUploadPlugin }) {
        this.fileUploadPlugin = fileUploadPlugin;
    }

    async uploadFile(fileStream, filename) {
        // Use the plugin's method to upload the file
        return await this.fileUploadPlugin.upload(fileStream, filename);
    }
}

export default FileUploadService;