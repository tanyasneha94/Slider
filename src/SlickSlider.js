import React, { useState, useEffect, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sliderConfig from "./config";
import useFetchPosts from "./useFetchPosts";

const SlickSlider = () => {
  const { posts, loading, error, fetchPosts } = useFetchPosts(sliderConfig.apiEndpoint);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (error && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        fetchPosts();
        setRetryCount((prevCount) => prevCount + 1);
      }, 3000);
      return () => clearTimeout(retryTimeout);
    }
    return undefined;
  }, [error, retryCount, fetchPosts]);

  const settings = useMemo(
    () => ({
      ...sliderConfig.sliderSettings,
      beforeChange: (current, next) => setCurrentSlide(next),
      appendDots: (dots) => {
        const activeSet = Math.floor(currentSlide / 3);
        const startDot = activeSet * 3;
        const endDot = startDot + 3;
        return (
          <ul style={{ margin: "0px" }}>
            {dots.map((dot, index) => (
              <li
                key={index}
                style={{
                  display:
                    index >= startDot && index < endDot
                      ? "inline-block"
                      : "none",
                }}
              >
                {dot}
              </li>
            ))}
          </ul>
        );
      },
    }),
    [currentSlide]
  );

  return (
    <div className="post-slider-container" aria-live="polite">
      <h2 className="slider-title">Posts Slider</h2>
      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : error ? (
        <div className="error-message">
          {error}
          <button type="button" onClick={fetchPosts} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
        <Slider {...settings}>
          {posts.map((post) => (
            <div key={post.id} className="slider-item">
              <AsyncImage
                src={`https://picsum.photos/id/${post.id}/400/300`}
                fallback="https://via.placeholder.com/400x300?text=Image+Unavailable"
                alt={post.title}
                className="card"
              >
                <div className="card-img-overlay-bg" />
                <div className="card-body">
                  <h5 className="post-title">{post.title}</h5>
                  <p className="post-text">{`${post.body.substring(0,100)}...`}</p>
                </div>
              </AsyncImage>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error("Failed to load image"));
  });

const AsyncImage = ({ src, fallback, alt, className, children }) => {
  const [imgSrc, setImgSrc] = useState(fallback);

  useEffect(() => {
    loadImage(src)
      .then((url) => setImgSrc(url))
      .catch(() => setImgSrc(fallback));
  }, [src, fallback]);

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${imgSrc})`,
      }}
      role="img"
      aria-label={alt}
    >
      {children}
    </div>
  );
};

export default SlickSlider;
