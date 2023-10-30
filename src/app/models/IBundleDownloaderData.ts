export interface IBundleDownloaderData {
  syncStatus:
    | 'DOWNLOADING_PACKAGE'
    | 'INSTALLING_UPDATE'
    | 'INSTALLATION_COMPLETE';
  downloadProgress?: {
    receivedBytes: number;
    totalBytes: number;
  };
}
