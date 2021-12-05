export const ordersQuery = `
query ($status: String, $page: Int, $limit: Int) {
  orders(status: $status, page: $page, limit: $limit) {
    total
    nodes {
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
}
`


export const orderQuery = `
query ($id: String!) {
  order(_id: $id) {
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
