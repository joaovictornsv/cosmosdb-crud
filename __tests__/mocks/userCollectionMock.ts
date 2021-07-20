import { Container } from '@azure/cosmos';

const usersCollectionMock = {
  items: {
    query: () => {},
    create: () => {},
  },
  item: () => ({
    read: () => {},
    delete: () => {},
    replace: () => {},
  }),
} as unknown as Container;

export { usersCollectionMock };
