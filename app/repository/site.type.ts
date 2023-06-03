import {ObjectId} from "mongodb";

export type Site = {
    _id?: ObjectId;
    domain: string;
    page: string;
    content: string;
}