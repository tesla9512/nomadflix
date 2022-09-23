import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMovieResult } from "../api";
import useWindow from "../useWindow";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  padding-bottom: 200px;
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

const Img = styled(motion.img)`
  position: absolute;
  right: 5%;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  width: 100%;
  top: -100px;
`;

const LR = styled(motion.svg)`
  position: absolute;
  width: 48px;
  top: 40px;
  margin: 0 10px;
  background: white;
  border-radius: 24px;
  padding-left: 8px;
  padding-right: 8px;
  cursor: pointer;
  z-index: 3;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(4, 1fr);
  width: 85%;
  left: 0;
  right: 0;
  margin: 0 auto;
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
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
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
`;

const Selected = styled(motion.div)`
  position: fixed;
  width: 60vw;
  height: 60vh;
  background-color: gray;
  color: black;
  top: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const SelectedImg = styled.img`
  position: absolute;
  height: 100%;
`;

const SelectedTitle = styled.h3`
  font-weight: bold;
  font-size: 36px;
  margin-left: 3%;
`;

const boxVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.5,
    y: -36,
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
  const windowWidth = useWindow();
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

  useEffect(() => {
    console.log(window.innerWidth);
  });

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
            <Img
              key={data?.results[offset * index].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={makeImagePath(
                data?.results[offset * index].poster_path || "",
                "w500"
              )}
              alt="cover"
              style={windowWidth > 1072 ? { width: "20vw" } : { width: "30vw" }}
            />
          </Banner>
          <Slider>
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
                      <SelectedImg
                        alt="cover"
                        src={makeImagePath(selectedMovie.poster_path, "w400")}
                      />
                      <SelectedTitle>{selectedMovie.title}</SelectedTitle>
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
