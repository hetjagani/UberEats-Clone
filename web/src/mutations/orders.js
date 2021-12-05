export const initOrderMutation = `
mutation initOrder($type: String!) {
  initOrder(type: $type) {
    _id
    amount
    customerId
    date
    status
    restaurantId
    type
    restaurant {
      _id
      name
      description
      address
      city
      state
      country
      contact_no
      food_type
      restaurant_type
      time_open
      time_close
      media {
        url
        alt_text
      }
      dishes {
        _id
        name
        description
        price
        food_type
        category
        media {
          url
          alt_text
        }
      }
    }
    orderitems {
      _id
      dishId
      notes
      price
      quantity
      restaurantId
      dish {
        category
        description
        food_type
        name
        price
        restaurantId
        media {
          url
          alt_text
        }
      }
    }
  }
}
`;

export const placeOrderQuery = `
mutation placeOrder($order: OrderReq!) {
  placeOrder(order: $order) {
    _id
    amount
    customerId
    date
    status
    restaurantId
    type
    restaurant {
      _id
      name
      description
      address
      city
      state
      country
      contact_no
      food_type
      restaurant_type
      time_open
      time_close
      media {
        url
        alt_text
      }
      dishes {
        _id
        name
        description
        price
        food_type
        category
        media {
          url
          alt_text
        }
      }
    }
    orderitems {
      _id
      dishId
      notes
      price
      quantity
      restaurantId
      dish {
        category
        description
        food_type
        name
        price
        restaurantId
        media {
          url
          alt_text
        }
      }
    }
  }
}
`