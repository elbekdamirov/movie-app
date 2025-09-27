import { useQuery } from "@tanstack/react-query"
import { fetchMovieBySearch } from "../api/fetchApi"

export const useSearchMovie = () => {
    const getMovieBySearch = (params: {query: string}) => useQuery({
        queryKey: ["searchMovieKey", params],
        queryFn: () => fetchMovieBySearch(params),
        enabled: !!params.query
    })

    return {getMovieBySearch}
}