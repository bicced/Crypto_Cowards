import { combineReducers } from 'redux'
import appReducer from './app/app_reducer'
import authReducer from './auth/auth_reducer'
import algosReducer from './algos/algos_reducer'
import cmcReducer from './cmc/cmc_reducer'
import notificationsReducer from './notifications/notification_reducer'
// takes all your seperate reducers into one giant reducer
// each Redux action will flow through each middleware and then reach the reducers
// then it will go through each reducer
const rootReducer = combineReducers({
	app: appReducer,
	auth: authReducer,
	algos: algosReducer,
	cmc: cmcReducer,
	notifications: notificationsReducer,
})

export default rootReducer
