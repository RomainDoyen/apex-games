import type { Bookmark } from "../types/types.ts";
import { axiosInstance, axiosInstanceBackend } from "./Instances.ts";

export const getAll = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getById = async (url: string, id: string) => {
    const response = await axiosInstance.get(`${url}/${id}`);
    return response.data;
};

//recupération des jeux depuis le backend (front->backend->appel api rawg)
export const getAllGames = async (url: string) => {
    const response = await axiosInstanceBackend.get(url);
    return response.data;
};

export const getByIdGame = async (url: string, id: string) => {
    const response = await axiosInstanceBackend.get(`${url}/${id}`);
    return response.data;
};

export const addGameToBacklog = async (url: string, data: Bookmark) => {
    const response = await axiosInstanceBackend.post<{ success: boolean; data: Bookmark }>(url, data);
    return response.data;
};

export const updateGame = async <T = unknown>(url: string, id: string, data: T) => {
    const response = await axiosInstanceBackend.put(`${url}/${id}`, data);
    return response.data;
};

export const patchGame = async <T = unknown>(url: string, data: T) => {
    const response = await axiosInstanceBackend.patch(url, data);
    return response.data;
};

export const deleteGame = async (url: string, id: string) => {
    const response = await axiosInstanceBackend.delete(`${url}/${id}`);
    return response.data;
};