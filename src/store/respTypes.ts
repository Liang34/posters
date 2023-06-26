// import { PageData, PageProps, ComponentData } from './editor'
// import { ActionPayload } from './index'
export interface RespData<T = {}> {
  errno: number;
  data: T;
  message?: string;
  payload?: any;
}
export interface ListData<T> {
  list: T[];
  count: number;
}
export interface WorkData extends Omit<any, 'props'> {
  content: {
    components: any[];
    props?: any;
  };
}
export interface UploadData {
  urls: string[];
}
export type RespListData<T> = RespData<ListData<T>>
export type RespWorkData = RespData<WorkData>
export type RespUploadData = RespData<UploadData>