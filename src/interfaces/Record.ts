export type Hash = string;

export interface IRecord {
    id?: number;
    hash: Hash;
    url: string;
    visits?: number;
    created_at?: Date;
    updated_at?: Date;
}
