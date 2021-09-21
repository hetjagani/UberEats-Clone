import React from 'react';
import withAuth from '../AuthPage/withAuth';
import Header from './Header';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './carousel_override.css';
import { Carousel } from 'react-responsive-carousel';
import { useStyletron } from 'baseui';
import { H5, H6, Paragraph2 } from 'baseui/typography';
import { useSelector } from 'react-redux';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Button } from 'baseui/button';
import DishCard from './DishCard';

const RestaurantDashboard = () => {
  const [css] = useStyletron();
  const imgContainer = css({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '80px',
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

  const { loginRestaurant, media, dishes } = useSelector((state) => {
    return {
      loginRestaurant: state.restaurants.loginRestaurant,
      media: state.restaurants.media,
      dishes: state.restaurants.dishes,
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div className={mainContainer}>
        <Header />

        <div className={imgContainer}>
          <Carousel
            autoPlay={true}
            dynamicHeight={true}
            interval={5000}
            showThumbs={false}
            infiniteLoop={true}
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
              {loginRestaurant.name} ({loginRestaurant.restaurant_type.toUpperCase()})
            </H5>
            <Paragraph2>{loginRestaurant.description}</Paragraph2>
            <Paragraph2>{loginRestaurant.address}</Paragraph2>
            <Paragraph2>
              {loginRestaurant.city} | {loginRestaurant.state} | {loginRestaurant.country}
            </Paragraph2>
          </div>
          <div>
            <Button>Add Dish</Button>
          </div>
        </div>
      </div>
      <div style={{ width: '90vw' }}>
        <FlexGrid flexGridColumnCount={3} flexGridColumnGap="scale800" flexGridRowGap="scale800">
          {dishes.length > 0 &&
            dishes.map((dish) => {
              return (
                <FlexGridItem {...itemProps} key={dish.id}>
                  <DishCard dish={dish} editable={true} resID={loginRestaurant.id} />
                </FlexGridItem>
              );
            })}
        </FlexGrid>
      </div>
    </div>
  );
};

export default withAuth(RestaurantDashboard, 'restaurant');
