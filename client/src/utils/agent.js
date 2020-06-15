import request from 'superagent'

import store from '@/store'
import { setSessionExpired } from '@/actions/session'

const agent = request
  .agent()
  .withCredentials(true)
  .ok(res => {
    store.dispatch(setSessionExpired(res.status === 401));
    return res.status < 400;
  })

export default agent
