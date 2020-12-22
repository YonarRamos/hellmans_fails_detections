export default function({ store, redirect }) {
  if (store.state.User.accessToken) {
    return redirect('')
  }
}
