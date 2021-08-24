import debugFactory from 'debug';
import {
	getShoppingCartManagerState,
	createSubscriptionManager,
	createActionPromisesManager,
	noopManager,
} from './managers';
import { createActions } from './shopping-cart-actions';
import {
	getInitialShoppingCartState,
	isStatePendingUpdateOrQueuedAction,
	reducerWithQueue as shoppingCartReducer,
} from './shopping-cart-reducer';
import { createTakeActionsBasedOnState } from './state-based-actions';
import { createCartSyncManager } from './sync';
import type {
	GetCart,
	SetCart,
	ShoppingCartManagerClient,
	ShoppingCartManagerState,
	ShoppingCartManager,
	ShoppingCartAction,
	ResponseCart,
	ShoppingCartReducerDispatch,
	DispatchAndWaitForValid,
	ActionPromises,
	ShoppingCartState,
} from './types';

const debug = debugFactory( 'shopping-cart:shopping-cart-manager' );

function createDispatchAndWaitForValid(
	dispatch: ShoppingCartReducerDispatch,
	actionPromises: ActionPromises
): DispatchAndWaitForValid {
	return ( action ) => {
		return new Promise< ResponseCart >( ( resolve ) => {
			actionPromises.add( resolve );
			dispatch( action );
		} );
	};
}

function createShoppingCartManager(
	cartKey: string,
	getCart: GetCart,
	setCart: SetCart
): ShoppingCartManager {
	let state = getInitialShoppingCartState();

	const subscriptionManager = createSubscriptionManager( cartKey );

	const syncManager = createCartSyncManager( cartKey, getCart, setCart );
	const actionPromises = createActionPromisesManager();
	const takeActionsBasedOnState = createTakeActionsBasedOnState( syncManager );

	let deferredStateCheck: ReturnType< typeof setTimeout >;
	const dispatch = ( action: ShoppingCartAction ) => {
		debug( `dispatching action for cartKey ${ cartKey }`, action.type );
		const newState = shoppingCartReducer( state, action );
		if ( newState === state ) {
			if ( ! isStatePendingUpdateOrQueuedAction( state ) ) {
				debug( 'state did not change; resolving action promises' );
				actionPromises.resolve( state.responseCart );
			}
			return;
		}
		state = newState;

		// We defer the state based actions so that multiple cart changes can be
		// batched together during the same run of the event loop.
		if ( deferredStateCheck ) {
			clearTimeout( deferredStateCheck );
		}
		deferredStateCheck = setTimeout( () => {
			takeActionsBasedOnState( state, dispatch );
		} );

		if ( ! isStatePendingUpdateOrQueuedAction( state ) ) {
			actionPromises.resolve( state.responseCart );
		}

		subscriptionManager.notifySubscribers();
	};

	// `dispatchAndWaitForValid` enhances the action dispatcher to return a
	// Promise that will resolve when the cart next reaches a `valid`
	// CacheStatus. This is the dispatcher used for all actions in the
	// ShoppingCartManager's public API.
	const dispatchAndWaitForValid = createDispatchAndWaitForValid( dispatch, actionPromises );
	const actions = createActions( dispatchAndWaitForValid );

	let cachedManagerState: ShoppingCartManagerState = getShoppingCartManagerState( state );
	let lastState: ShoppingCartState = state;

	const getCachedManagerState = (): ShoppingCartManagerState => {
		if ( lastState !== state ) {
			cachedManagerState = getShoppingCartManagerState( state );
			lastState = state;
		}
		return cachedManagerState;
	};

	let didInitialFetch = false;
	const initialFetch = () => {
		if ( didInitialFetch ) {
			return Promise.resolve( state.lastValidResponseCart );
		}
		didInitialFetch = true;
		takeActionsBasedOnState( state, dispatch );
		return new Promise< ResponseCart >( ( resolve ) => {
			actionPromises.add( resolve );
		} );
	};

	return {
		subscribe: subscriptionManager.subscribe,
		actions,
		getState: getCachedManagerState,
		fetchInitialCart: initialFetch,
	};
}

export function createShoppingCartManagerClient( {
	getCart,
	setCart,
}: {
	getCart: GetCart;
	setCart: SetCart;
} ): ShoppingCartManagerClient {
	const managersByCartKey: Record< string, ShoppingCartManager > = {};

	function forCartKey( cartKey: string | undefined ): ShoppingCartManager {
		if ( ! cartKey ) {
			return noopManager;
		}

		if ( ! managersByCartKey[ cartKey ] ) {
			debug( `creating cart manager for "${ cartKey }"` );
			managersByCartKey[ cartKey ] = createShoppingCartManager( cartKey, getCart, setCart );
		}

		return managersByCartKey[ cartKey ];
	}

	return {
		forCartKey,
	};
}