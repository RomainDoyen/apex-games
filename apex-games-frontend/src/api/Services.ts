import axiosInstance from "./Instances.ts";

export const getAll = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

export const getById = async (url: string, id: string) => {
    const response = await axiosInstance.get(`${url}/${id}`);
    return response.data;
};