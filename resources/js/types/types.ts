export type FolderResourceType = {
    name: string;
    id: number;
    uuid: string;
};
export type FileResourceType = {
    name: string;
    size: string;
    size_bytes: number;
    date: string;
    folders: number[];
    type: FileType;
    url: string;
    thumbnail_url: string | null;
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
