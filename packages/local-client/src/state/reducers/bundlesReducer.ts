import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundlesState {
	[key: string]:
		| {
				code: string;
				loading: boolean;
				error: string;
		  }
		| undefined;
}
const initialState: BundlesState = {};

const reducer = produce(
	(state: BundlesState = initialState, action: Action): BundlesState => {
		switch (action.type) {
			case ActionType.BUNDLE_START:
				state[action.payload.cellId] = {
					loading: true,
					code: '',
					error: '',
				};
				return state;
			case ActionType.BUNDLE_COMPLETE:
				const { code, error } = action.payload.bundle;
				state[action.payload.cellId] = {
					loading: false,
					code,
					error,
				};
				return state;
			default:
				return state;
		}
	}
);

export default reducer;
