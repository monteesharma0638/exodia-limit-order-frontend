import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';

interface IUseApiQuery extends UseQueryOptions {
  url: string,
}

export const useApiQuery = ({url, ...options }: IUseApiQuery) => {
  return useQuery({
    ...options,
    queryFn: async () => fetch(url).then(resonse => resonse.json()).catch(err => {
      console.log("🚀 ~ useApiQuery ~ err:", err);
      return [];
    }),
  });
};

export const useApiMutation = (method = 'POST') => {
  return useMutation({
    mutationFn: ({ url, data }: {url: string, data: any}) => fetch(url, { method, body: data }).then(response => response.json()),
  });
};