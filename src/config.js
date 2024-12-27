const sliderConfig = {
    sliderSettings: {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    },
    apiEndpoint: "https://jsonplaceholder.typicode.com/posts",
  };
  
  export default sliderConfig;
  