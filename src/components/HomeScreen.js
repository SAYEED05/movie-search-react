import React, { useState, useEffect } from "react";
import axios from "axios";

function HomeScreen() {
  //USING USESTATE HOOKS TO SET THE VALUE OF SEARCH QUERY
  const [query, setQuery] = useState("");

  //USING USESTATE HOOKS TO SET THE RESULT OF FETCHED DATA
  const [movieData, setMovieData] = useState([]);

  //USING USESTATE HOOKS TO SET THE RESPONSE OF FETCHED DATA
  const [response, setResponse] = useState(false);

  //USING USESTATE HOOKS TO SET THE INFORMATION OF A SPECIFIC MOVIE
  const [movieInfo, setMovieInfo] = useState([]);

  //CHANGING THE STATE OF SHOW DETAIL
  const [showDetails, setShowDetails] = useState(false);

  //USING USESTATE HOOKS TO CHANGING THE PAGE NUMBER
  const [page, setPage] = useState(1);
  //GETTING TOTAL RESULTS FROM THE API
  const [totalResults, setTotalResults] = useState(0);

  const [searchedQuery, setSearchedQuery] = useState("");

  //CALCULATING NUMBER OF PAGES USING TOTAL RESULTS
  const pages =
    totalResults % 10 === 0 ? totalResults / 10 : ~~(totalResults / 10) + 1;

  //GETTING API KEY FROM .env FILE
  const API_KEY = process.env.REACT_APP_API_KEY;

  //SEARCH FUNCTION

  const search = (e) => {
    //FETCHING THE DATA FROM API
    axios
      .get(`http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}&page=${page}`) //API URL
      .then((response) => {
        if (response.data.Response === "True") {
          setResponse(true);
          setMovieData(response.data.Search); //ASSIGNING THE DATA OF THE RESPONSE TO MovieData
          query !== searchedQuery && setPage(1); //RESETTING THE PAGE TO 1 IF THE SEARCH QUERY CHANGES
          setTotalResults(response.data.totalResults); //ASSIGNING THE VALUE OF TOTAL RESULT RESPONSE
          setSearchedQuery(query);
        } else {
          setResponse(false);
          setPage(1); //resetting page number
        }
      })
      .catch((error) => console.log(error)); //CATCHING ANY ERROR IF IT OCCURS
  };

  //USE EFFECT HOOK TO RERENDER THE DOM IF THE PAGE IS CHANGED

  useEffect(() => {
    search();
    window.scroll(0, 0);
    // eslint-disable-next-line
  }, [page]);

  //TOHANDLE ENTER BUTTON IN INPUT FORM

  const enterHandle = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  //GET DETAILS OF A SPECIFIC MOVIE

  const viewDetails = (id) => {
    setMovieInfo([]); //RESETTING PREVIOUSLY FETCHED INFO
    axios
      .get(`http://www.omdbapi.com/?i=${id}&apikey=${API_KEY}&plot=full`) //API URL
      .then((response) => setMovieInfo(response.data)) //ASSIGNING THE DATA OF THE RESPONSE TO movieInfo
      .catch((error) => setMovieInfo(error)); //CATCHING ANY ERROR IF IT OCCURS

    setShowDetails(!showDetails);
  };

  return (
    <div className="container" style={{ margin: "20px" }}>
      {/* SEARCH SECTION */}
      {!showDetails && (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "50px" }}
        >
          <input
            className="search-bar"
            type="text"
            placeholder="Search Movies,Series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={enterHandle}
          />
          <button className="search-button" onClick={search}>
            <img
              style={{ width: "20px", height: "20px" }}
              src="/assets/icons/search.svg"
              alt="search-icon"
            />
          </button>
        </div>
      )}
      {response && !showDetails && (
        <div>
          Search Result for{" "}
          <span style={{ fontWeight: "bold", fontStyle: "italic" }}>
            {searchedQuery}
          </span>
        </div>
      )}

      {/* CARDS SECTION */}

      {!response && !showDetails && searchedQuery !== "" && (
        <div>No Results Found</div>
      )}

      {!showDetails && response && (
        <>
          <div className="cards-wrapper">
            {response &&
              movieData.map((movie) => (
                <div
                  className="card-inner-wrapper"
                  key={movie.imdbID}
                  onClick={() => viewDetails(movie.imdbID)}
                >
                  <div
                    className="card-contents"
                    style={{ whiteSpace: "break-spaces", textAlign: "left" }}
                  >
                    <img
                      style={{
                        width: "260px",
                        height: "386px",
                        borderRadius: "4px 4px 0 0",
                      }}
                      src={
                        movie.Poster !== "N/A" //CHECKING WHEATHER THE MOVIE HAS POSTER IF NOT SETTING NOT AVAILABLE IMAGE
                          ? movie.Poster
                          : "assets/images/not-available-placeholder.png"
                      }
                      alt="movie-poster"
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px 0",
                        width: "260px",
                      }}
                    >
                      <p className="title" style={{ fontWeight: "bold" }}>
                        {movie.Title}
                        <span style={{ fontWeight: "200" }}>
                          ({movie.Type})
                        </span>
                      </p>
                      <p className="year" style={{ color: "#1f80e0" }}>
                        {movie.Year}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="pagination">
            {[...Array(pages)].map((value, index) => (
              <button
                className="pagination-button"
                style={{
                  backgroundColor: index + 1 === page ? "#1f80e0" : "#202020",
                  opacity: index + 1 === page ? "1" : "0.6",
                }}
                key={index}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* DETAILS SECTION*/}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showDetails && (
          <div className="details-card-wrapper">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="details-close-button"
                onClick={() => setShowDetails(false)}
              >
                <img
                  src="/assets/icons/x-circle.svg"
                  style={{ width: "50px", height: "50px" }}
                  alt="close-icon"
                />
              </button>
            </div>

            <div className="details-cards">
              <div
                className="detail-card-image"
                style={{ margin: " 0 50px 0 0" }}
              >
                <img
                  className="detail-image"
                  src={movieInfo.Poster}
                  alt="movie-poster"
                />
              </div>
              <div
                className="detail-card-details"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="name-rating"
                >
                  <h2 style={{ fontWeight: "bold" }}>{movieInfo.Title}</h2>
                  <p>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#1f80e0",
                        fontSize: "20px",
                      }}
                    >
                      {movieInfo.imdbRating}
                    </span>{" "}
                    /10
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "20px 0",
                  }}
                  className="rated-genre"
                >
                  <p>{movieInfo.Genre}</p>
                  <p>{movieInfo.Rated}</p>
                </div>
                <div className="runtime" style={{ marginBottom: "10px" }}>
                  <p>
                    Runtime:
                    <span style={{ fontWeight: "bold", color: "#1f80e0" }}>
                      {movieInfo.Runtime}
                    </span>
                  </p>
                </div>
                <p>{movieInfo.Plot}</p>
                <div className="cast" style={{ margin: "10px 0" }}>
                  Cast : {"  "}
                  {movieInfo.Actors}
                </div>
                <div className="director" style={{ margin: "10px 0" }}>
                  Director : {"  "}
                  {movieInfo.Director}
                </div>
                <div className="writer" style={{ margin: "10px 0" }}>
                  Writer : {"  "}
                  {movieInfo.Writer}
                </div>
                <div className="release-date" style={{ margin: "10px 0" }}>
                  Release : {"  "}
                  <span style={{ color: "#1f80e0", fontWeight: "bold" }}>
                    {movieInfo.Released}
                  </span>
                </div>
                <div className="language" style={{ margin: "10px 0" }}>
                  Language : {"  "}
                  {movieInfo.Language}
                </div>
                {movieInfo.Type === "movie" && (
                  <div className="box-office" style={{ margin: "10px 0" }}>
                    Box Office : {"  "}
                    <span style={{ color: "#1f80e0", fontWeight: "bold" }}>
                      {movieInfo.BoxOffice}
                    </span>
                    <div className="production" style={{ margin: "10px 0" }}>
                      Production : {"  "}
                      {movieInfo.Production}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
