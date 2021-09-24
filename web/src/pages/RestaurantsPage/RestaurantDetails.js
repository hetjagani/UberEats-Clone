import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './carousel_override.css';
import { Carousel } from 'react-responsive-carousel';
import { useStyletron } from 'baseui';
import { H5, Paragraph2 } from 'baseui/typography';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import DishCard from './../RestaurantDashboard/DishCard';
import axios from 'axios';
import notify from '../../utils/notify';
import NavBar from './NavBar';

const RestaurantDetails = () => {
  const { id } = useParams();

  const [css] = useStyletron();
  const imgContainer = css({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
  });

  const mainContainer = css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100vw',
  });

  const itemProps = {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const [restaurant, setRestaurant] = useState({});
  const [media, setMedia] = useState({});
  const [dishes, setDishes] = useState({});

  useEffect(() => {
    axios
      .get(`/restaurants/${id}`)
      .then((res) => {
        setRestaurant(res.data);
        setMedia(res.data.media);
        setDishes(res.data.dishes);
      })
      .catch((err) => {
        console.error(err);
        notify({ type: 'error', description: 'Error fetching restaurant' });
      });
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div className={mainContainer}>
        <NavBar />
        <div className={imgContainer}>
          <Carousel
            autoPlay={true}
            dynamicHeight={true}
            interval={5000}
            showThumbs={false}
            infiniteLoop={true}
            showIndicators={false}
          >
            {media &&
              media.length > 0 &&
              media.map((m) => {
                return (
                  <div key={m.id}>
                    <img src={m.url} alt={m.alt_text} width="500" />
                  </div>
                );
              })}
          </Carousel>
        </div>

        <div
          className={css({
            alignSelf: 'baseline',
            margin: '30px',
            display: 'flex',
            justifyContent: 'space-between',
          })}
        >
          <div className={css({ width: '80vw' })}>
            <H5>
              {restaurant.name} ({restaurant.restaurant_type})
            </H5>
            <Paragraph2>{restaurant.description}</Paragraph2>
            <Paragraph2>{restaurant.address}</Paragraph2>
            <Paragraph2>
              {restaurant.city} | {restaurant.state} | {restaurant.country}
            </Paragraph2>
          </div>
        </div>
      </div>
      <div style={{ width: '90vw' }}>
        <FlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
          {dishes.length > 0 &&
            dishes.map((dish) => {
              return (
                <FlexGridItem
                  onClick={() => {
                    alert(`open dish modal for ${dish.id} ${dish.name}`);
                  }}
                  {...itemProps}
                  key={dish.id}
                >
                  <DishCard dish={dish} editable={false} resID={restaurant.id} />
                </FlexGridItem>
              );
            })}
        </FlexGrid>
      </div>
    </div>
  );
};

export default RestaurantDetails;
