import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Card, StyledAction, StyledBody, StyledThumbnail } from 'baseui/card';
import { Paragraph1 } from 'baseui/typography';
import React from 'react';

const DishCard = ({ dish, editable }) => {
  const [css] = useStyletron();

  let featuredMediaURL = '';
  if (dish.media && dish.media.length > 0) {
    featuredMediaURL = dish.media[0].url;
  }

  return (
    <>
      <Card overrides={{ Root: { style: { width: '100%', margin: '10px' } } }} title={dish.name}>
        <StyledThumbnail src={featuredMediaURL} />
        <StyledBody>
          <Paragraph1>{dish.description} </Paragraph1>
          <Paragraph1>
            <strong>Price: </strong> ${dish.price} <br />
            <strong>Food Type: </strong> ${dish.food_type} <br />
            <strong>Category: </strong> {dish.category.replace('_', ' ')} <br />
          </Paragraph1>
        </StyledBody>
        {editable && (
          <StyledAction>
            <Button overrides={{ BaseButton: { style: { width: '100%' } } }}>Edit</Button>
          </StyledAction>
        )}
      </Card>
    </>
  );
};

export default DishCard;
