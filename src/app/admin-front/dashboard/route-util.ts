interface List {
  icon: string,
  name: string,
  route: string
}

export interface Display {
  title: string;
  array: List[];
}

export const DASHBOARDLINKS: Display[] = [
  {
    title: 'quick links',
    array: [
      {
        icon: 'insert_chart_outlined',
        name: 'statistics',
        route: 'statistics',
      },
      {
        icon: 'shopping_basket-hunt',
        name: 'new product',
        route: 'new-product',
      },
      {
        icon: 'new_releases',
        name: 'new category',
        route: 'new-category',
      },
      {
        icon: 'card_giftcard',
        name: 'new collection',
        route: 'new-collection',
      },
    ]
  },
  {
    title: 'catalog',
    array: [
      {
        icon: 'shopping_basket-hunt',
        name: 'product',
        route: 'product',
      },
      {
        icon: 'flare',
        name: 'category',
        route: 'category'
      },
      {
        icon: 'filter_center_focus',
        name: 'collection',
        route: 'collection',
      },
    ]
  },
  {
    title: 'customer',
    array: [
      {
        icon: 'account_box',
        name: 'customer',
        route: 'customer',
      }
    ]
  },
  {
    title: 'register',
    array: [
      {
        icon: 'build',
        name: 'register',
        route: 'register',
      }
    ]
  }
];
