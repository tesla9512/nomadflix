import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { getSearchMovie, ISearch } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 100px;
`;

const Result = styled.p`
  margin-top: 100px;
  margin-left: 60px;
  margin-bottom: 20px;
  font-size: 24px;
`;

const Nodata = styled.p`
  margin-top: 100px;
  margin-left: 60px;
  font-size: 30px;
`;

const Page = styled.span`
  position: absolute;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #ffe56f;
  }
`;

const Prev = styled(Page)`
  left: 60px;
`;

const Next = styled(Page)`
  right: 60px;
`;

const Items = styled.ul`
  margin-left: 60px;
`;
const Item = styled.li`
  cursor: pointer;
  background-color: #111;
  margin-right: 60px;
  height: 150px;
  margin-bottom: 20px;
  a {
    display: flex;
    align-items: center;
    font-size: 36px;
    &:hover {
      color: #ffe56f;
    }
    img {
      width: 100px;
      margin-right: 40px;
    }
  }
`;

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const page = searchParams.get("page");
  const [currentPage, setPage] = useState(Number(page));
  const { data, isLoading, refetch } = useQuery(["search"], () => {
    if (keyword) {
      return getSearchMovie(keyword, currentPage);
    }
  });

  const nextPage = (direction: number) => {
    if (direction > 0) {
      setPage((prev) =>
        prev === data.total_pages ? data.total_pages : prev + 1
      );
    } else {
      setPage((prev) => (prev === 1 ? 1 : prev - 1));
    }
  };

  useEffect(() => {
    navigate(`/search?keyword=${keyword}&page=${currentPage}`);
    refetch();
    // console.log(currentPage, data);
  }, [currentPage, keyword, navigate, refetch]);

  return (
    <Wrapper>
      {isLoading ? null : data.results.length === 0 ? (
        <Nodata>No search data</Nodata>
      ) : (
        <>
          <Result>
            page : {page}, result : {data.total_results} &#40;{data.total_pages}{" "}
            pages&#41;
          </Result>
          {currentPage === 1 ? null : (
            <Prev onClick={() => nextPage(-1)}>&#60;&nbsp;prev</Prev>
          )}
          {currentPage === data.total_pages ? null : (
            <Next onClick={() => nextPage(1)}>next&nbsp;&#62;</Next>
          )}
          <br /> <br />
          <Items>
            {data.results.map((i: ISearch) => (
              <Item key={i.id}>
                <Link to={`/movies/detail/${i.id}`} state={i.id}>
                  <img src={makeImagePath(i.poster_path, "w200")} alt="cover" />
                  {i.title}&nbsp; &#40;
                  {(i.release_date || "").length === 0
                    ? "no data"
                    : (i.release_date || "").split("-")[0]}
                  &#41;
                </Link>
              </Item>
            ))}
          </Items>
          {currentPage === 1 ? null : (
            <Prev onClick={() => nextPage(-1)}>&#60;&nbsp;prev</Prev>
          )}
          {currentPage === data.total_pages ? null : (
            <Next onClick={() => nextPage(1)}>next&nbsp;&#62;</Next>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
