import {UploadFile} from "element-plus";

export interface UploadFileRes extends UploadFile {
  id: string;
  url: string;
}
