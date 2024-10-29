import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getMovieSearch } from "../apis/movie";
import { GetSearchMovieResult } from "../types/data/movie";
import { styled } from "styled-components";
import React from "react";
import { makeImagePath } from "../func/utilities";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  justify-content: center;
`;

const Cover = styled.div`
  width: 100%;
  height: 100vh;

  background-size: cover;
  background-position: center center;

  position: absolute;
  z-index: -1;
`;

const InfoWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 48px;
`;

const OverView = styled.p`
  font-size: 18px;
  margin-top: 20px;
`;

export default function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const { data, isLoading } = useQuery<GetSearchMovieResult>(
    ["search", "movie"],
    () => getMovieSearch(keyword)
  );

  const movie = data?.results && data.results[0];

  return (
    <React.Fragment>
      {movie ? (
        <Wrapper>
          <Cover
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), url(
                ${makeImagePath(movie.backdrop_path || movie.poster_path)}
              )`,
            }}
          />
          <InfoWrapper>
            <Title>{movie.title}</Title>
            <OverView>{movie.overview}</OverView>
          </InfoWrapper>
        </Wrapper>
      ) : (
        <Title>해당 정보가 없습니다.</Title>
      )}
    </React.Fragment>
  );
}
