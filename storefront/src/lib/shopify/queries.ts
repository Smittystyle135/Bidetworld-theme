import {
  CART_FRAGMENT,
  COLLECTION_FRAGMENT,
  IMAGE_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_FRAGMENT,
} from "./fragments";

const ARTICLE_CARD_FRAGMENT = /* GraphQL */ `
  fragment ArticleCardFields on Article {
    id
    handle
    title
    excerpt
    publishedAt
    tags
    image {
      ...ImageFields
    }
    authorV2 {
      name
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const BLOG_QUERY = /* GraphQL */ `
  query Blog($handle: String!, $first: Int!) {
    blog(handle: $handle) {
      title
      handle
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          ...ArticleCardFields
        }
      }
    }
  }
  ${ARTICLE_CARD_FRAGMENT}
`;

export const ARTICLE_QUERY = /* GraphQL */ `
  query Article($blog: String!, $handle: String!) {
    blog(handle: $blog) {
      title
      handle
      articleByHandle(handle: $handle) {
        ...ArticleCardFields
        contentHtml
        seo {
          title
          description
        }
      }
    }
  }
  ${ARTICLE_CARD_FRAGMENT}
`;

export const MENU_QUERY = /* GraphQL */ `
  query Menu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
        items {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
  }
`;

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections {
    collections(first: 100, sortKey: TITLE) {
      nodes {
        ...CollectionFields
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      ...CollectionFields
      products(first: 100, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ProductCardFields
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PRODUCT_RECOMMENDATIONS_QUERY = /* GraphQL */ `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductCardFields
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

export const PAGE_QUERY = /* GraphQL */ `
  query Page($handle: String!) {
    page(handle: $handle) {
      title
      handle
      body
      seo {
        title
        description
      }
    }
  }
`;

export const ALL_HANDLES_QUERY = /* GraphQL */ `
  query AllHandles {
    products(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
    collections(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
    blog(handle: "news") {
      articles(first: 250, sortKey: PUBLISHED_AT, reverse: true) {
        nodes {
          handle
          publishedAt
        }
      }
    }
  }
`;

export const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;
