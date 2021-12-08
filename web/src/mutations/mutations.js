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
export const createCustomer = `
mutation createCustomer($customer: CustomerReq!) {
  createCustomer(customer: $customer) {
    _id
    name
    nickname
    about
    city
    state
    country
    contact_no
    medium{
      url
      alt_text
    }
    favourites {
      restaurantId
    }
  }
}`

export const createRestaurant = `
mutation createRestaurant($restaurant: RestaurantReq!) {
  createRestaurant(restaurant: $restaurant) {
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
    media{
      url
      alt_text
    }
  }
}`

export const createDish = `
mutation createDish($dish: DishReq!) {
  createDish(dish: $dish) {
    _id
    name
    description
    price
    food_type
    category
    restaurantId
    media{
      url
      alt_text
    }
  }
}`

export const createFavourite =`
mutation createFavourite($restaurantId: String!) {
  createFavourite(restaurantId: $restaurantId) {
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
    dishes{
      _id
      name
      description
      price
    }
    media{
      url
      alt_text
    }
  }
}`

export const addCartItem = `
mutation addCartItem($cartItem: CartItemReq!) {
  addCartItem(cartItem: $cartItem) {
    _id
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
        alt_text
      }
    }
    dish {
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
}`