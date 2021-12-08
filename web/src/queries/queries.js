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
`;

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

export const restaurantsQuery = `
  query (
    $city: String
    $restaurant_type: String
    $food_type: String
    $q: String
    $page: Int
    $limit: Int
    $address: String
  ) {
    restaurants(
      city: $city
      restaurant_type: $restaurant_type
      food_type: $food_type
      q: $q
      page: $page
      limit: $limit
      address: $address
    ) {
      total
      nodes {
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
    }
  }
`;

export const restaurantQuery = `
query ($id: String!) {
  restaurant(_id: $id) {
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
}
`;

export const dishQuery = `
query dish($id: String!, $restaurantId: String!) {
  dish(_id: $id, restaurantId: $restaurantId) {
    _id
    name
    description
    price
    food_type
    category
    restaurantId
    media {
      _id
      url
      alt_text
    }
  }
}
`

export const dishesQuery = `
query dishes($restaurantId: String!, $page: Int, $limit: Int) {
  dishes(restaurantId: $restaurantId, page: $page, limit: $limit) {
    total
    nodes {
      _id
      name
      description
      price
      food_type
      category
      restaurantId
      media {
        _id
        url
        alt_text
      }
    }
  }
}
`

export const customer = `
query customer($id: String!) {
  customer(_id: $id) {
    _id
    name
    nickname
    about
    city
    state
    country
    contact_no
    medium {
      alt_text
      url
    }
    favourites {
      restaurantId
      restaurant {
        _id
        name
        description
      }
    }
  }
}
`

export const favourites = `
query {
  favourites {
    restaurantId
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

export const addresses = `
query {
  addresses {
    _id
    firstLine
    secondLine
    zipcode
    city
    state
    country
    customerId
  }
}
`

export const address = `
query address($id: String!) {
  address(_id: $id) {
    _id
    firstLine
    secondLine
    zipcode
    city
    state
    country
    customerId
  }
}
`

export const cartitems = `
query  {
  cartitems {
    _id
    restaurantId
    dishId
    quantity
    notes
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
      }
      dishes {
        name
        description
        price
        food_type
        category
      }
    }
    dish {
      _id
      name
      description
      price
      food_type
      category
      media {
        url
      }
    }
  }
}
`