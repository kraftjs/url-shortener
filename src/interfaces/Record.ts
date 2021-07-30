export const RECORD_TTL = 24;

export type Hash = string;

export type Url = string;

export interface IRecord {
    id: number;
    hash: Hash;
    url: Url;
    visits: number;
    created_at: Date;
    updated_at: Date;
}
