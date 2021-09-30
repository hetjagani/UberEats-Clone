import React, { useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import axios from 'axios';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import notify from '../../utils/notify';
import { BiFoodTag, BiMap, BiTime } from 'react-icons/bi';
import { Paragraph1 } from 'baseui/typography';
import { Button } from 'baseui/button';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdFavouriteBorder, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { addCustomerFavourite, deleteCustomerFavourite } from '../../actions/customers';

const RestaurantsGrid = ({ favs }) => {
  const [css] = useStyletron();
  const mainContainer = css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
  });

  const itemProps = {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const paraStyle = css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  });

  const logoStyle = css({
    margin: '5px',
  });

  const [restaurants, setRestaurants] = useState([]);
  const [favMap, setFavMap] = useState({});

  const { favourites } = useSelector((state) => {
    return { favourites: state.customers.favourites };
  });

  useEffect(() => {
    axios
      .get(`/restaurants`)
      .then((res) => {
        if (res.data.total > 0) {
          setRestaurants(res.data.nodes);
        }
      })
      .catch((err) => {
        notify({ type: 'error', description: 'Error fetching restaurants' });
      });
  }, []);

  useEffect(() => {
    const fm = {};
    restaurants.forEach((res) => {
      fm[res.id] = false;
    });
    favourites.forEach((fav) => {
      fm[fav.restaurantId] = true;
    });
    setFavMap(fm);
  }, [favourites]);

  const history = useHistory();
  const favouriteIcon = <MdFavorite size={40} />;
  const notFavouriteIcon = <MdFavoriteBorder size={40} />;

  const gotoDetails = (id) => {
    history.push(`/restaurants/${id}`);
  };

  const dispatch = useDispatch();

  const toggleFavourite = (id) => {
    if (favMap[id] == true) {
      // delete favourite
      dispatch(deleteCustomerFavourite(id));
    } else {
      // add favourite
      dispatch(addCustomerFavourite({ restaurantId: id }));
    }
  };

  return (
    <div className={mainContainer}>
      <FlexGrid
        flexGridColumnCount={4}
        width="100%"
        flexGridColumnGap="scale800"
        flexGridRowGap="scale800"
      >
        {restaurants &&
          restaurants.map((res) => {
            return favs ? (
              favMap[res.id] && (
                <FlexGridItem {...itemProps}>
                  <Card
                    overrides={{
                      Root: { style: { width: '450px', height: 'fit-content' } },
                      HeaderImage: {
                        style: { height: '150px', width: '500px', objectFit: 'cover' },
                      },
                      Body: { style: { height: 'fit-content' } },
                    }}
                    headerImage={
                      res.media && res.media.length > 0 ? res.media[0].url : 'images/food.jpg'
                    }
                    title={res.name}
                  >
                    <StyledBody>
                      <Paragraph1 className={paraStyle}>
                        <BiMap size="20" className={logoStyle} /> {res.address}
                      </Paragraph1>
                      <Paragraph1 className={paraStyle}>
                        <BiTime size="20" className={logoStyle} /> {res.time_open} -{' '}
                        {res.time_close}
                      </Paragraph1>
                      <Paragraph1 className={paraStyle}>
                        <BiFoodTag
                          size="20"
                          color={res.food_type == 'veg' ? 'green' : 'red'}
                          className={logoStyle}
                        />
                        <strong>{res.restaurant_type}</strong>
                      </Paragraph1>
                    </StyledBody>
                    <StyledAction>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Button kind="minimal" onClick={() => toggleFavourite(res.id)}>
                          {favMap[res.id] ? favouriteIcon : notFavouriteIcon}
                        </Button>
                        <Button onClick={() => gotoDetails(res.id)}>Details</Button>
                      </div>
                    </StyledAction>
                  </Card>
                </FlexGridItem>
              )
            ) : (
              <FlexGridItem {...itemProps}>
                <Card
                  overrides={{
                    Root: { style: { width: '450px', height: 'fit-content' } },
                    HeaderImage: {
                      style: { height: '150px', width: '500px', objectFit: 'cover' },
                    },
                    Body: { style: { height: 'fit-content' } },
                  }}
                  headerImage={
                    res.media && res.media.length > 0 ? res.media[0].url : 'images/food.jpg'
                  }
                  title={res.name}
                >
                  <StyledBody>
                    <Paragraph1 className={paraStyle}>
                      <BiMap size="20" className={logoStyle} /> {res.address}
                    </Paragraph1>
                    <Paragraph1 className={paraStyle}>
                      <BiTime size="20" className={logoStyle} /> {res.time_open} - {res.time_close}
                    </Paragraph1>
                    <Paragraph1 className={paraStyle}>
                      <BiFoodTag
                        size="20"
                        color={res.food_type == 'veg' ? 'green' : 'red'}
                        className={logoStyle}
                      />
                      <strong>{res.restaurant_type}</strong>
                    </Paragraph1>
                  </StyledBody>
                  <StyledAction>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button kind="minimal" onClick={() => toggleFavourite(res.id)}>
                        {favMap[res.id] ? favouriteIcon : notFavouriteIcon}
                      </Button>
                      <Button onClick={() => gotoDetails(res.id)}>Details</Button>
                    </div>
                  </StyledAction>
                </Card>
              </FlexGridItem>
            );
          })}
      </FlexGrid>
    </div>
  );
};

export default RestaurantsGrid;
