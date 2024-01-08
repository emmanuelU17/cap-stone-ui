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
      }
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
    title: 'setting',
    array: [
      {
        icon: 'local_shipping',
        name: 'shipping',
        route: 'setting/shipping',
      },
      {
        icon: 'attach_money',
        name: 'tax',
        route: 'setting/tax',
      }
    ]
  },
];
