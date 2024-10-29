import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useQuery } from "react-query";

import { getMovies } from "../apis/movie";
import { GetMoviesResult } from "../types/data/movie";
import { makeImagePath } from "../func/utilities";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 1rem;
`;

const OverView = styled.p`
  font-size: 20px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -200px;
  margin-bottom: 100px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  width: 100%;
  position: absolute;
`;

const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 64px;
  cursor: pointer;
  &:last-child {
    transform-origin: center right;
  }
  &:first-child {
    transform-origin: center left;
  }
`;

const BoxInfo = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
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

const MovieDetail = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const DetailCover = styled.div`
  width: 100%;
  height: 60%;

  background-size: cover;
  background-position: center center;
`;

const DetailDescWrap = styled.div`
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -100px;
  padding: 20px;
`;

const DetailTitle = styled.h2`
  font-size: 48px;
`;

const DetailOverView = styled.div`
  margin-top: 40px;
`;

const rowVariants: Variants = {
  hidden: {
    x: window.innerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth + 5,
  },
};

const boxVariants: Variants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

const boxInfoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, type: "tween", duration: 0.3 },
  },
};

export default function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { data, isLoading } = useQuery<GetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const movieCountInSlide = 6;

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / movieCountInSlide) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => {
    history.goBack();
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const sliderMovies = data?.results
    .slice(1)
    .slice(
      movieCountInSlide * index,
      movieCountInSlide * index + movieCountInSlide
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>로딩중...</Loader>
      ) : (
        <React.Fragment>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(
              data?.results[0].backdrop_path ||
                data?.results[0].poster_path ||
                ""
            )}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial={"hidden"}
                animate={"visible"}
                exit={"exit"}
                transition={{ type: "tween", duration: 1 }}
              >
                {sliderMovies
                  ? sliderMovies.map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        onClick={() => onBoxClicked(movie.id)}
                        variants={boxVariants}
                        initial={"normal"}
                        whileHover={"hover"}
                        transition={{ type: "tween" }}
                        $bgPhoto={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )}
                      >
                        <BoxInfo
                          variants={boxInfoVariants}
                          transition={{ type: "tween" }}
                        >
                          <h4>{movie.title}</h4>
                        </BoxInfo>
                      </Box>
                    ))
                  : null}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {clickedMovie ? (
              <React.Fragment>
                <Overlay
                  onClick={onOverlayClicked}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <MovieDetail layoutId={clickedMovie.id + ""}>
                  <DetailCover
                    style={{
                      backgroundImage: `linear-gradient(transparent, black), url(${makeImagePath(
                        clickedMovie.backdrop_path || clickedMovie.poster_path
                      )})`,
                    }}
                  />
                  <DetailDescWrap>
                    <DetailTitle>{clickedMovie.title}</DetailTitle>
                    <DetailOverView>{clickedMovie.overview}</DetailOverView>
                  </DetailDescWrap>
                </MovieDetail>
              </React.Fragment>
            ) : null}
          </AnimatePresence>
        </React.Fragment>
      )}
    </Wrapper>
  );
}
