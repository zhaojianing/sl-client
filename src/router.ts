import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        needLogin: true,
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
      children: [
        {
          path: '/home/product',
          name: 'product',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/product.vue'),
        },
        {
          path: '/home/warehouse',
          name: 'warehouse',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/warehouse.vue'),
        },
        {
          path: '/home/material',
          name: 'material',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/material.vue'),
        },
        {
          path: '/home/return',
          name: 'return',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/return.vue'),
        },
        {
          path: '/home/overview',
          name: 'overview',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/overview.vue'),
        },
        {
          path: '/home/machine',
          name: 'machine',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/machine.vue'),
        },
        {
          path: '/home/bagging',
          name: 'bagging',
          meta: {
            needLogin: true,
          },
          component: () => import('./views/pages/bagging.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to: any, from: any, next: any) => {
  // 全局钩子函数
  to.matched.some((route: any) => {
      // to.matched.forEach((route) => {
      if (route.meta.needLogin) {
          // 通过此操作可以判断哪些页面需要登录
          if (document.cookie !== "") {
              next();
          } else {
              next({ name: 'login', params: { path: "/" } });
          }
      } else {
          next();
      }
  });

});

export default router;
