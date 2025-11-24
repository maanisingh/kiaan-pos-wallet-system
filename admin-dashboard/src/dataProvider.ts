import { DataProvider } from '@refinedev/core';
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create();

export const customDataProvider = (apiUrl: string): DataProvider => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { data: response } = await axiosInstance.get(url);

    return {
      data: response.data || [],
      total: response.total || 0,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${resource}`;
    const { data: response } = await axiosInstance.get(url);

    return {
      data: response.data.filter((item: any) => ids.includes(item.id)),
    };
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.get(url);

    return {
      data: data.data || data,
    };
  },

  create: async ({ resource, variables, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const { data } = await axiosInstance.post(url, variables);

    return {
      data: data.data || data,
    };
  },

  update: async ({ resource, id, variables, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.put(url, variables);

    return {
      data: data.data || data,
    };
  },

  deleteOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await axiosInstance.delete(url);

    return {
      data: data.data || data,
    };
  },

  getApiUrl: () => apiUrl,

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    let requestUrl = `${url}`;

    const { data } = await axiosInstance({
      url: requestUrl,
      method,
      data: payload,
      params: query,
      headers,
    });

    return {
      data: data.data || data,
    };
  },
});
