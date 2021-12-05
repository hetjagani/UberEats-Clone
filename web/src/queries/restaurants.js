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
`