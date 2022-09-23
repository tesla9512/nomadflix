import { useSearchParams } from "react-router-dom";

function Search() {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("keyword"));
  return <></>;
}

export default Search;
