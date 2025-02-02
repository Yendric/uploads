export type FolderResourceType = {
    name: string;
    id: number;
    uuid: string;
};
export type FileResourceType = {
    name: string;
    size: number;
    date: string;
    folders: number[];
    type: FileType;
    url: string;
    id: number;
    uuid: string;
};

export enum FileType {
    Image = "IMAGE",
    Video = "VIDEO",
    Text = "TEXT",
    Pdf = "PDF",
    Office = "OFFICE",
    Other = "OTHER",
}
