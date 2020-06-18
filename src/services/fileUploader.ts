import { injectable, inject } from "tsyringe";
import { IServerConfig } from "./serverConfig";
import { TYPES, serviceProvider } from "./dependencyInjection";
import Axios from "axios";

@injectable()
export class FileUploader {
  public constructor(
    @inject("server_config") private endpoints: IServerConfig,
  ) {}

  public async uploadFile(
    file: File[],
    callback?: (progress: number) => void,
  ): Promise<string[]> {
    let form = new FormData();
    for (let f of file) {
      form.append("file", f);
    }

    let response = await Axios.post<{ fileResultList: string[] }>(
      this.endpoints.apiBaseUrl + this.endpoints.apiEndpoints.file.post,
      form,
      {
        onUploadProgress: (event: ProgressEvent) => {
          if (callback) callback(event.loaded / event.total);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (response.status >= 300) throw new Error(JSON.stringify(response));
    return response.data.fileResultList;
  }
}

export function getFileUri(fileId: string): string {
  let serverConfig = serviceProvider.resolve<IServerConfig>("server_config");
  return serverConfig.getFile.replace("{name}", fileId);
}
