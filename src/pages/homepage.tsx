import { useState, useEffect, useRef } from "react";
import axios from "axios";
import searchIcon from "../assets/icons/search.png";
import GoldPoint from "../assets/icons/gold-point.png";
import ArrowRight from "../assets/icons/btn_arrow_carton_left.png";
import ArrowDown from "../assets/icons/btn_arrow_carton_down.png";
import CaretLeft from "../assets/icons/arrow-left_carton.png";
import CaretRight from "../assets/icons/arrow-right-carton.png";
import ThumbUp from "../assets/icons/thumb-up.png";
import ThumbDown from "../assets/icons/thumb-down.png";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Button, { IconButton, IconButtonAlt } from "../components/Base/Buttons";
import { JokeI } from "../interface";

const categoryStyles = [
  "category-red",
  "category-pastel-orange",
  "category-pale-orange",
  "category-light-gold",
  "category-kiwi-green",
  "category-wired-green",
  "category-light-blue",
];

const HomePage = () => {
  const [mainJokeList, setMainJokeList] = useState<Array<JokeI>>([]);
  const [jokeList, setJokeList] = useState<Array<JokeI>>([]);
  const [jokeCategoryList, setJokeCategoryList] = useState<Array<string>>([]);
  const [jokesByCategory, setJokesByCategory] = useState({});
  const [currentJoke, setCurrentJoke] = useState<JokeI>();
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [currentJokeList, setCurrentJokeList] = useState<Array<JokeI>>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentLimit, setCurrentLimit] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Array<JokeI>>([]);

  const [showSinglePage, setShowSinglePage] = useState(false);
  const canViewMore = currentLimit >= jokeList.length;

  const jokeListRef = useRef<HTMLDivElement>(null);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === "") {
      setJokeList(mainJokeList);
    } else {
      if (
        jokesByCategory[category] !== undefined &&
        jokesByCategory[category].length > 0
      ) {
        setJokeList(jokesByCategory[category]);
      } else {
        setJokeList([]);
      }
    }
  };

  const viewMore = () => {
    setCurrentLimit(currentLimit + 10);
    setCurrentJokeList(jokeList.slice(0, currentLimit + 10));
  };

  const getJokeCategories = async () => {
    return axios
      .get(`https://api.chucknorris.io/jokes/categories`)
      .then((res) => {
        setJokeCategoryList([...res.data, "uncategorized"]);
      })
      .catch((error) => console.error(error.message));
  };

  const sortJokesByCategory = (jokeList)=>{
    const jokesByCategory = [];
    jokesByCategory["uncategorized"] = [];
    jokeList.map((joke) => {
      if (joke.categories.length === 0) {
        jokesByCategory["uncategorized"].push(joke);
      } else {
        joke.categories.map((category: string) => {
          if (!jokesByCategory.hasOwnProperty(category)) {
            jokesByCategory[category] = [];
          }
          jokesByCategory[category].push(joke);
          return;
        });
      }

      return joke;
    });

    return jokesByCategory;
  }

  const getJokeList = async () => {
    return axios
      .get(`https://api.chucknorris.io/jokes/search?query=all`)
      .then((res) => {
        let jokeList = res.data.result;
        jokeList = jokeList.map((joke)=>{
          return {...joke, likes: 0, dislikes: 0 }
        })
        const jokesByCategory = sortJokesByCategory(jokeList);

        setJokesByCategory(jokesByCategory);
        setMainJokeList(jokeList);
        setJokeList(jokeList);
      })
      .catch((error) => console.error(error.message));
  };

  const search = (value) => {
    setSearchTerm(value);
    const result = mainJokeList.filter((joke: JokeI) =>
      joke.value.includes(value)
    );
    if (result.length === 1) {
      setCurrentJoke(result[0]);
      toggleShowSinglePage();
    } else {
      if (showSinglePage) toggleShowSinglePage();
    }
    setSearchResult(result);
  };

  const continueSearch = () => {
    setSearchTerm("");
    setJokeList(searchResult);
    jokeListRef.current?.scrollIntoView();
  };

  const showJoke = (joke: JokeI) => {
    const jokeIndex = jokeList.findIndex((o)=>o.id === joke.id);
    setCurrentJoke(joke);
    setCurrentJokeIndex(jokeIndex);
    toggleShowSinglePage();
  };

  const toggleShowSinglePage = () => setShowSinglePage(!showSinglePage);

  const prevJoke = () => {
    if (currentJokeIndex > 0) {
      const newIndex = currentJokeIndex - 1;
      setCurrentJokeIndex(newIndex);
      setCurrentJoke(jokeList[newIndex]);
    }
  };

  const nextJoke = () => {
    if (currentJokeIndex < currentJokeList.length - 1) {
      const newIndex = currentJokeIndex + 1;
      setCurrentJokeIndex(newIndex);
      setCurrentJoke(jokeList[newIndex]);
    }
  };

  const likeJoke = (joke)=>{
    likeDislikeJoke(joke, "like");
  }

  const dislikeJoke = (joke)=>{
    likeDislikeJoke(joke, "dislike");
  }
  const likeDislikeJoke = (joke, action)=>{
    const newCurrentJokeList = [...currentJokeList];
    const currentIndex = newCurrentJokeList.findIndex((o)=>o.id === joke.id);
    action === 'like' ? newCurrentJokeList[currentIndex].likes += 1 :newCurrentJokeList[currentIndex].dislikes += 1
    setCurrentJokeList(newCurrentJokeList);

    // update MainJokeList
    const newMainJokeList = [...mainJokeList];
    const itemIndex = newMainJokeList.findIndex((o) => o.id === joke.id)

    action === 'like' ? newMainJokeList[itemIndex].likes += 1 : newMainJokeList[itemIndex].dislikes += 1

    // break new data into categories
    const newJokesByCategory = sortJokesByCategory(newMainJokeList);

    setMainJokeList(newMainJokeList);
    setJokesByCategory(newJokesByCategory)
    // setJokeList(newMainJokeList);
  }

  useEffect(() => {
    (async () => {
      await getJokeCategories();
      await getJokeList();
    })();
  }, );

  useEffect(() => {
    jokeList.length > 0
      ? setCurrentJokeList(jokeList.slice(0, 10))
      : setCurrentJokeList([]);
  }, [jokeList]);

  return (
    <div className="homepage">
      <NavBar />
      <div className="hero">
        <div className="hero__content">
          <div className="hero__content--head">The Joke Bible</div>
          <div className="hero__content--text">
            Daily laugh for you and yours
          </div>
          <div className="hero__content--search">
            <div>
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="How can we make you laugh today?"
                  value={searchTerm}
                  onChange={(e) => search(e.target.value)}
                  onKeyPress={(ev) => {
                    if (ev.key === "Enter") continueSearch();
                  }}
                />
                <button className={"button-icon"} onClick={continueSearch}>
                  <img src={searchIcon} alt="" />
                </button>
                <div
                  className={
                    "search-result " +
                    (searchTerm.length > 0 ? "search-result__show" : "")
                  }
                >
                  <ul className={"search-result__list"}>
                    {searchResult.length > 0
                      ? searchResult.slice(0, 4).map((result, index) => (
                          <li
                            className={"search-result__list--item"}
                            key={index}
                          >
                            <img src={GoldPoint} alt="" />
                            <span>
                              {" "}
                              {result.categories.length > 0
                                ? result.categories[0] + " Joke"
                                : "Uncategorized"}{" "}
                              :{" "}
                            </span>
                            <span> {result.value.substring(0, 30)} </span>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!showSinglePage ? (
        <div className="main">
          <div className="categories">
            {jokeCategoryList.length > 0
              ? jokeCategoryList.map((category: string, index: number) => (
                  <Button
                    key={index}
                    text={category}
                    className={
                      "btn category " +
                      categoryStyles[index % categoryStyles.length]
                    }
                    onClick={() => selectCategory(category)}
                  />
                ))
              : null}
            <IconButton
              text="View All"
              className="btn category category-all"
              onClick={() => selectCategory("")}
              icon={ArrowDown}
            />
          </div>
          <div className="tags">
            <span className="tag">
              {selectedCategory === "" ? "all" : selectedCategory} Jokes
            </span>
          </div>

          <div className="jokes" ref={jokeListRef}>
            {currentJokeList.length > 0
              ? currentJokeList.map((joke: JokeI, index: number) => (
                  <div className="joke-card" key={index}>
                    <div className="joke-card__head">
                      <img
                        src={GoldPoint}
                        alt=""
                        className={"joke-card__head--img"}
                      />
                      <div className={"joke-card__head--text"}>
                        {joke.categories.length > 0
                          ? joke.categories[0] + " Joke"
                          : "Uncategorized"}
                      </div>
                    </div>
                    <div className="joke-card__text">{joke.value}</div>
                    <div className="joke-card__button">
                      <IconButton
                        text={"See Stats"}
                        className={"joke-card__button-btn"}
                        onClick={() => {
                          showJoke(joke);
                        }}
                        icon={ArrowRight}
                        arrowButton
                      />
                    </div>
                  </div>
                ))
              : null}
            <div className={"jokes__button"}>
              <IconButton
                text="View More"
                className="btn category category-all jokes__button-btn"
                onClick={viewMore}
                icon={ArrowDown}
                isDisabled={canViewMore}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="single">
          <div className="back__button">
            <button
              className={"icon-button-rounded"}
              onClick={toggleShowSinglePage}
            >
              <img src={CaretLeft} alt="" />
            </button>
          </div>
          <div className={"single__group"}>
            {currentJoke && Object.keys(currentJoke).length !== 0 ? (
              <div className="single__main">
                <div className="single-joke">
                  <div className="single-joke__tags">
                    <div className="">
                      <span className="tag">
                        {currentJoke.categories.length > 0
                          ? currentJoke.categories[0] + " Joke"
                          : "Uncategorized"}{" "}
                      </span>
                    </div>
                    <div className="single-joke__tags--main">
                      <span className="single-joke__tags--main-dot"></span>
                      Trending
                    </div>
                  </div>
                  <div className="single-joke__head">
                    {currentJoke.value.split(" ").slice(0, 3).join(" ")}
                  </div>
                  <div className="single-joke__value">{currentJoke.value}</div>
                </div>
                <div className="joke-actions">
                  <div className="joke-actions__left">
                    <div className="joke-actions__vote">
                      <button className="icon-button-rounded  thumbs-up" onClick={()=>likeJoke(currentJoke)}>
                        <img src={ThumbUp} alt="" />
                      </button>
                      {currentJoke.likes}
                    </div>
                    <div>
                      <button className="icon-button-rounded thumbs-down" onClick={()=>dislikeJoke(currentJoke)}>
                        <img src={ThumbDown} alt="" />
                      </button>
                      {currentJoke.dislikes}
                    </div>
                  </div>
                  <div className="joke-actions__right">
                    <IconButtonAlt
                      text="Prev Joke"
                      className="btn category category-all jokes__button-btn"
                      onClick={prevJoke}
                      icon={CaretLeft}
                      arrowButton
                    />
                    <IconButton
                      text="Next Joke"
                      className="btn category category-all jokes__button-btn"
                      onClick={nextJoke}
                      icon={CaretRight}
                      arrowButton
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="single__sidebar">
              <div className="single__sidebar--title">
                Top 10 Joke of the Week
              </div>
              <ul className="single__sidebar--items">
                <li className="single__sidebar--item">
                  collection of all the Chuck facts.
                </li>
                <li className="single__sidebar--item">
                  collection of all the Chuck facts.
                </li>
                <li className="single__sidebar--item">
                  collection of all the Chuck facts.
                </li>
                <li className="single__sidebar--item">
                  collection of all the Chuck facts.
                </li>
                <li className="single__sidebar--item">
                  collection of all the Chuck facts.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
