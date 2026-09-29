import type { S3UploadProgressParams } from "@/modules/user/issues/types";

export async function uploadFileToS3({
  uploadUrl,
  file,
  onProgress,
}: S3UploadProgressParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Failed to upload file to S3. Status: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during S3 upload."));
    };

    xhr.send(file);
  });
}
