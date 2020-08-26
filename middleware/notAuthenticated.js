/**
 * 已经登陆的状态，无法登陆登陆页面，
 * @param {拦截中间件} param0 
 */
export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (store.state.user) {
    return redirect('/')
  }
}
