import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import { getSearchMovie } from "../api";

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  // const { data, isLoading } = useQuery(["search"], () => {
  //   if (keyword) {
  //     getSearchMovie(keyword);
  //   }
  // });
  console.log(keyword);
  return <></>;
}

export default Search;
