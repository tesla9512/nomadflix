import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getDeatilMovie, IGetMoiveDetail } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: transparent;
  overflow-x: hidden;
  height: 100vh;
`;

const Loader = styled.div`
  height: 200vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Backspace = styled.span`
  position: fixed;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: 64px;
  bottom: 0%;
  background-color: transparent;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  span {
    position: absolute;
    margin-bottom: 2px;
    color: white;
    left: 60px;
  }
  svg {
    fill: white;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 24px;
    position: absolute;
    width: 36px;
    left: 10px;
  }
  &:hover {
    span,
    svg {
      color: #96ee84;
      fill: #96ee84;
    }
  }
`;

const Banner = styled.div<{ bgimage: string }>`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  z-index: -1;
  background-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2)),
    url(${(props) => props.bgimage});
  background-size: cover;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 50px;
  font-style: oblique;
  width: 80%;
  word-break: keep-all;
  letter-spacing: 2px;
  margin-bottom: 20px;
  margin-top: 150px;
  margin-left: 5%;
`;

const Tagline = styled.h3`
  color: #ffe56f;
  font-size: 30px;
  font-style: oblique;
  letter-spacing: 4px;
  margin-bottom: 20px;
  margin-left: 5%;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 40%;
  margin-left: 5%;
  margin-bottom: 20px;
`;

const Info = styled.div`
  position: absolute;
  width: 50%;
  margin-left: 5%;
  bottom: 150px;
`;

const Adult = styled.span`
  font-size: 24px;
  font-weight: bold;
  color: tomato;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  margin: 10px;
`;

const Runtime = styled(Adult)`
  color: #4fdd4f;
`;
const Genre = styled(Adult)`
  color: #ffc061;
`;
const Rating = styled(Adult)`
  color: #66b6eb;
`;
const Production = styled(Adult)`
  color: white;
  font-style: oblique;
  font-size: 20px;
  font-weight: normal;
`;

const Img = styled.img`
  position: absolute;
  max-width: 30%;
  height: auto;
  right: 5vw;
  bottom: 150px;
`;

function Detail() {
  const navigate = useNavigate();
  const { state: moiveId } = useLocation();
  const { data, isLoading } = useQuery<IGetMoiveDetail>(["detail"], () =>
    getDeatilMovie(moiveId)
  );
  // console.log(data, isLoading);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Backspace onClick={() => navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            <span>Back</span>
          </Backspace>
          <Img
            src={makeImagePath(data?.poster_path || "", "w500")}
            alt="cover"
          />
          <Banner bgimage={makeImagePath(data?.backdrop_path || "")}>
            <Title>{data?.title}</Title>
            <Tagline>{data?.tagline}</Tagline>
            <Overview>{data?.overview}</Overview>
          </Banner>
          <Info>
            <Runtime>{data?.runtime} min</Runtime>
            <br />
            {data?.adult && <Adult>R18</Adult>}
            {data?.genres.map((i) => (
              <Genre key={i.id}>{i.name}</Genre>
            ))}
            <br />
            <Rating>RATE : {data?.vote_average}</Rating>
            <br />
            <br />
            {data?.production_companies.map((i) => (
              <Production key={i.id}>
                {i.name}
                <br />
              </Production>
            ))}
          </Info>
        </>
      )}
    </Wrapper>
  );
}

export default Detail;
