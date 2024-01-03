
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', component: () => import('pages/StayTuned.vue') },
      { path: 'ridianliang/addUser', component: () => import('pages/Ridianliang/AddUser.vue') },
      { path: 'ridianliang/exportDetail', component: () => import('pages/Ridianliang/ExportDetail.vue') },
      { path: ':catchAll(.*)*', component: import('pages/StayTuned.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/StayTuned.vue')
  }
]

export default routes
