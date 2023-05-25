import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'customers', component: () => import('pages/CustomerPage.vue')},
      { path: 'customers/client/:chronoClient', component: () => import('pages/CustomerDetailPage.vue')
      
    },
      
      { path: 'refs', children: [
          { path: 'products', component: () => import('pages/ProductPage.vue') },
          { path: 'productList', component: () => import('pages/productList.vue') },
          { path: 'produits/:code', component: () => import('pages/productDetailPage.vue') },
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
