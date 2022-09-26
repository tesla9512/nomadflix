import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovieResult } from "../api";
// import useWindow from "../useWindow";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  padding-bottom: 220px;
`;

const Loader = styled.div`
  height: 200vh;
  /* text-align: center; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled(motion.div)<{ bgimage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0)),
    url(${(props) => props.bgimage});
  background-size: cover;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 60px;
  width: 60vw;
  word-break: keep-all;
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

// const Img = styled(motion.img)`
//   position: absolute;
//   max-width: 30%;
//   height: auto;
//   right: 5%;
// `;

const Overview = styled.p`
  font-size: 24px;
  margin-bottom: 20px;
  width: 50%;
`;

const Detail = styled.span`
  font-size: 36px;
  font-style: oblique;
  font-weight: bold;
  letter-spacing: 4px;
  color: #ffe56f;
  width: 50%;
  background: rgba(0, 0, 0, 0.2);
  a:hover {
    color: white;
  }
`;

const Slider = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;

  span {
    font-size: 30px;
    font-weight: bold;
    margin-left: 20px;
  }
`;

const LR = styled.svg`
  position: absolute;
  width: 48px;
  top: 40px;
  margin: 60px 1.5vw;
  background: white;
  border-radius: 24px;
  padding-left: 9px;
  padding-right: 9px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    background: #96ee84;
    fill: white;
  }
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(4, 1fr);
  width: 85%;
  left: 0;
  right: 0;
  margin: 20px auto;
  z-index: 2;
`;

const Box = styled(motion.div)<{ bgimage: string }>`
  cursor: pointer;
  height: 140px;
  font-size: 54px;
  font-weight: bold;
  letter-spacing: 2px;
  background-image: url(${(props) => props.bgimage});
  background-size: cover;
  background-position: center center;
  /* &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  } */
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    color: white;
    font-size: 12px;
    text-align: center;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  z-index: 2;
`;

const Selected = styled(motion.div)`
  position: fixed;
  width: 400px;
  height: 600px;
  color: black;
  top: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  z-index: 3;
`;

const SelectedOverlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SelectedImg = styled.img`
  position: absolute;
`;

const SelectedTitle = styled.h3`
  font-weight: bold;
  font-size: 30px;
  color: white;
  margin-top: 225px;
  width: 100%;
  height: 100px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  letter-spacing: 2px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const SelectedOverview = styled.span`
  color: white;
  font-size: 20px;
  position: absolute;
  display: inline;
  text-align: center;
  height: 200px;
  margin: 330px 8px 0 8px;
`;

const SelectedDetail = styled.span`
  color: white;
  font-size: 30px;
  font-weight: bold;
  font-style: oblique;
  width: 400px;
  height: 100px;
  display: flex;
  align-items: center;
  z-index: 4;
  margin-top: 500px;
  a {
    width: 100%;
    text-align: right;
    margin-right: 24px;
    letter-spacing: 2px;
    &:hover {
      color: #96ee84;
    }
  }
`;

const boxVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.3,
    y: -35,
    transition: {
      type: "tween",
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const rowVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? window.innerWidth : -window.innerWidth,
  }),
  center: { x: 0 },
  exit: (direction: number) => ({
    x: direction < 0 ? window.innerWidth : -window.innerWidth,
  }),
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
    },
  },
};

const offset = 5;

function Home() {
  const navigate = useNavigate();
  // const windowWidth = useWindow();
  const { data, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (moiveId: number) => {
    navigate(`/movies/${moiveId}`);
  };
  const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:id");
  const onOverlayClick = () => {
    navigate(-1); //goback
  };
  const slidePage = (dir: number) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      const total = data.results.length;
      const max = Math.floor(total / offset) - 1;
      setDirection(() => dir);

      if (dir > 0) {
        setIndex((prev) => (prev === max ? 0 : prev + dir));
      } else {
        setIndex((prev) => (prev === 0 ? max : prev - 1));
      }
    }
  };
  const selectedMovie =
    moviePathMatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === moviePathMatch?.params.id);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            key={data?.results[offset * index].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            bgimage={makeImagePath(
              data?.results[offset * index].backdrop_path || ""
            )}
          >
            <Title>{data?.results[offset * index].title}</Title>
            <Overview>{data?.results[offset * index].overview}</Overview>
            {/* <Img
              key={data?.results[offset * index].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={makeImagePath(
                data?.results[offset * index].poster_path || "",
                "w500"
              )}
              alt="cover"
            /> */}
            <Detail>
              <Link
                to={`/movies/detail/${data?.results[offset * index].id}`}
                state={data?.results[offset * index].id}
              >
                Go Detail &nbsp; &gt;
              </Link>
            </Detail>
          </Banner>
          <Slider>
            <span>Now Playing</span>
            <LR
              onClick={() => slidePage(-1)}
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </LR>
            <AnimatePresence
              initial={false}
              custom={direction}
              onExitComplete={toggleLeaving}
            >
              <Row
                custom={direction}
                variants={rowVariants}
                animate="center"
                initial="enter"
                exit="exit"
                transition={{ type: "tween" }}
                key={index}
              >
                {data?.results
                  .slice(offset * index + 1, offset * index + offset)
                  .map((movie) => (
                    <Box
                      variants={boxVariants}
                      initial="idle"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      layoutId={movie.id + ""}
                      key={movie.id}
                      bgimage={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <LR
              onClick={() => slidePage(1)}
              style={{ right: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
            </LR>
          </Slider>
          <AnimatePresence>
            {moviePathMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <Selected layoutId={moviePathMatch.params.id}>
                  {selectedMovie && (
                    <>
                      <SelectedOverlay />
                      <SelectedImg
                        alt="cover"
                        src={makeImagePath(selectedMovie.backdrop_path, "w400")}
                      />
                      <SelectedTitle>{selectedMovie.title}</SelectedTitle>
                      <SelectedOverview>
                        {selectedMovie.overview.length > 300
                          ? `${selectedMovie.overview.slice(0, 300)}...`
                          : selectedMovie.overview}
                      </SelectedOverview>
                      <SelectedDetail>
                        <Link
                          to={`/movies/detail/${selectedMovie.id}`}
                          state={selectedMovie.id}
                        >
                          Go Detail &nbsp; &gt;
                        </Link>
                      </SelectedDetail>
                    </>
                  )}
                </Selected>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
