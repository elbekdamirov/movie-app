import { api } from "@/shared/api"

export const fetchMovieBySearch = async (params: {query: string}) => {
    const response = await api.get(`/search/movie`, {params})
    return response.data
}